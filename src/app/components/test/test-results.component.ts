import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Test, TestResult, TestNote, SkillScore } from './test';
import { TestService } from './test.service';
import { Skill } from '../skill/skill';
import { SkillService } from '../skill/skill.service';
import { Student } from '../student/student';
import { StudentService } from '../student/student.service';

@Component({
  selector: 'ssi-test-results',
  templateUrl: 'test-results.component.html',
  styleUrls: ['test-results.component.css']
})
export class TestResultsComponent implements OnInit {
  private testId: String;

  test: Test;
  testName: String;
  // skillColumns: SkillColumnDefinition[] = [];
  displayedColumns: String[] = ['Elève'];
  testOverviews: TestOverview[] = [];
  dataStore: TestOverviewStore;
  dataSource: TestOverviewDataSource;
  studentNames: any[] = [];
  skillColumns: SkillColumnDefinition[] = [];

  constructor(private route: ActivatedRoute,
              private testService: TestService,
              private studentService: StudentService,
              private skillService: SkillService) {}

  async ngOnInit() {
    this.route.params.map(param => param.id).subscribe(id => {
      this.testId = id;
    });
    await this.updateTest();
  }

  async updateTest(): Promise<void> {
    this.test = await this.testService.getTest(this.testId);
    this.testName = this.test.name;
    await this.loadStudentNames();
    await this.buildSkillColumns();
    this.testOverviews = this.buildAllTestOverviews();
    this.dataStore = new TestOverviewStore(this.testOverviews);
    this.dataSource = new TestOverviewDataSource(this.dataStore);
  }

  buildAllTestOverviews(): TestOverview[] {
    const testOverviews: TestOverview[] = [];
    _.forEach(this.test.results, result => testOverviews.push(new TestOverview(result, this.test.skills)));

    return testOverviews;
  }

  async loadStudentNames(): Promise<void> {
    const students: Student[] = await this.studentService.getStudents(this.test.classID);
    _.forEach(students, student => this.studentNames.push({id: student.id, name: student.lastName + ' ' + student.firstName}));
  }

  async buildSkillColumns(): Promise<void> {
    const skills: Skill[] = await this.skillService.getSkills();

    _.forEach(this.test.skills, testSkill => {
      const skillName = _.find(skills, skill => skill.id === testSkill.skillID).shortName;
      const column = new SkillColumnDefinition(skillName, testSkill.skillID, testSkill.scoringScale);
      this.skillColumns.push(column);
      this.displayedColumns.push(column.columnName);
    });
    this.displayedColumns.push('total');
    this.displayedColumns.push('total20');
  }

  getStudentName(studentID: string): String {
    return _.find(this.studentNames, studentName => studentName.id === studentID);
  }

  getMaxNote(skillId: String): number {
    return _.find(this.test.skills, skill => skill.skillID === skillId).scoringScale;
  }

  getTestNote(studentId: String, skillId: String): TestNote {
    const testResult: TestResult = _.find(this.test.results, result => result.studentID === studentId);
    return _.find(testResult.notes, note => note.skillID === skillId);
  }

  updateTestNote(newValue, studentId, skillId) {
    const testOverview: TestOverview = _.find(this.testOverviews, current => current.testResult.studentID === studentId);
    const testNote: TestNote = _.find(testOverview.testResult.notes, current => current.skillID === skillId);
    testNote.skillNote = newValue;
    testOverview.updateTotals();
    this.dataStore.dataChange.next(this.testOverviews);
    this.testService.updateTest(this.test);
  }

  getTabIndex(studentId: String, colId: number): number {
    const rowId = _.findIndex(this.test.results, result => result.studentID === studentId);

    return colId + (rowId * this.test.skills.length);
  }

  getClassAverage20() {
    let average = 0;
    let average20 = 0;
    let nbPresent = 0;
    let total = 0;
    let maxTotal = 0;

    _.forEach(this.test.skills, skill => maxTotal += skill.scoringScale);

    _.forEach(this.testOverviews, testOverview => {
      if (!_.isNull(testOverview.total)) {
        nbPresent++;
        total += testOverview.total;
      }
    });

    average = total / nbPresent;
    average20 = Math.round((20 * average / maxTotal) * 10) / 10;

    return average20;
  }
}

export class SkillColumnDefinition {
  private name: String;
  private header: String;
  private skillId: String;
  private scoreScale: number;

  constructor(name: String, skillId: String, scoreScale: number) {
    this.name = skillId;
    this.header = name;
    this.skillId = skillId;
    this.scoreScale = scoreScale;
  }

  get columnScoreScale(): number {
    return this.scoreScale;
  }

  get columnName(): String {
    return this.name;
  }

  get columnHeader(): String {
    return this.header;
  }
}

export class TestOverview {
  testResult: TestResult;
  maxTotal= 0;
  total = 0;
  total20: number;

  constructor(testResult: TestResult, skillScores: SkillScore[]) {
    this.testResult = testResult;
    _.forEach(skillScores, skillScore => this.maxTotal += skillScore.scoringScale);
    this.updateTotals();
  }

  updateTotals() {
    this._calculateTotal();
    this._calculateTotal20();
  }

  private _calculateTotal() {
    this.total = 0;
    for (let i = 0; i < this.testResult.notes.length; i++) {
      if (_.isNull(this.testResult.notes[i].skillNote)) {
        this.total = null;
        break;
      } else {
        this.total += this.testResult.notes[i].skillNote;
      }
    }
  }

  private _calculateTotal20() {
    this.total20 = _.isNull(this.total) ? null : Math.round((20 * this.total / this.maxTotal) * 10) / 10;
  }
}

export class TestOverviewStore {
  dataChange: BehaviorSubject<TestOverview[]> = new BehaviorSubject<TestOverview[]>([]);

  constructor(rows: TestOverview[]) {
    this.dataChange.next(rows);
  }
}

export class TestOverviewDataSource extends DataSource<any> {
  constructor(private store: TestOverviewStore) {
    super();
  }

  connect(): Observable<TestOverview[]> {
    return this.store.dataChange;
  }

  disconnect() {}
}
