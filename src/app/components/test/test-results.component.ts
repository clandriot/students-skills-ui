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
    this.dataStore = new TestOverviewStore(this.buildAllTestOverviews());
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

  updateTestNote(newValue) {
    this.dataStore.dataChange.next(this.buildAllTestOverviews());
    this.testService.updateTest(this.test);
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
    this._calculateTotal();
    this._calculateTotal20();
  }

  private _calculateTotal() {
    _.forEach(this.testResult.notes, note => this.total += note.skillNote);
  }

  private _calculateTotal20() {
    this.total20 = Math.round((20 * this.total / this.maxTotal) * 10) / 10;
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
