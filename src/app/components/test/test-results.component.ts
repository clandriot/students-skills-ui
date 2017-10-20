import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Test, TestResult, TestNote } from './test';
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
  dataSource: TestResultsDataSource;
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
    this.dataSource = new TestResultsDataSource(new TestResultsStore(this.test.results));
  }

  async loadStudentNames(): Promise<void> {
    const students: Student[] = await this.studentService.getStudents(this.test.classID);
    _.forEach(students, student => this.studentNames.push({id: student.id, name: student.lastName + ' ' + student.firstName}));
  }

  async buildSkillColumns(): Promise<void> {
    const skills: Skill[] = await this.skillService.getSkills();

    _.forEach(this.test.skills, testSkill => {
      const skillName = _.find(skills, skill => skill.id === testSkill.skillID).shortName;
      const column = new SkillColumnDefinition(skillName, testSkill.skillID);
      this.skillColumns.push(column);
      this.displayedColumns.push(column.columnName);
    });
  }

  getStudentName(studentID: string): String {
    return _.find(this.studentNames, studentName => studentName.id === studentID);
  }

  getTestNote(studentId: String, skillId: String): TestNote {
    const testResult: TestResult = _.find(this.test.results, result => result.studentID === studentId);
    return _.find(testResult.notes, note => note.skillID === skillId);
  }
}

export class SkillColumnDefinition {
  private name: String;
  private header: String;
  private skillId: String;

  constructor(name: String, skillId: String) {
    this.name = skillId;
    this.header = name;
    this.skillId = skillId;
  }

  get columnName(): String {
    return this.name;
  }

  get columnHeader(): String {
    return this.header;
  }
}

export class TestResultsStore {
  dataChange: BehaviorSubject<TestResult[]> = new BehaviorSubject<TestResult[]>([]);

  constructor(rows: TestResult[]) {
    this.dataChange.next(rows);
  }

  get data(): TestResult[] {
    return this.dataChange.value;
  }

  set data(value: TestResult[]) {
    console.log(value);
  }
}

export class TestResultsDataSource extends DataSource<any> {
  constructor(private store: TestResultsStore) {
    super();
  }

  connect(): Observable<TestResult[]> {
    return this.store.dataChange;
  }

  disconnect() {}
}