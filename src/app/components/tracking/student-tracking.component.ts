import * as _ from 'lodash';

import { Component, Input, OnChanges } from '@angular/core';

import { Student } from '../student/student';
import { Class } from '../class/class';
import { ClassService } from '../class/class.service';
import { Skill } from '../skill/skill';
import { SkillService } from '../skill/skill.service';
import { Test, TestNote } from '../test/test';
import { TestService } from '../test/test.service';
import { ChartSerie, ChartData } from './chart-model';


@Component({
  selector: 'ssi-student-tracking',
  templateUrl: 'student-tracking.component.html',
  styleUrls: ['student-tracking.component.css']
})
export class StudentTrackingComponent implements OnChanges {
  constructor(private classService: ClassService, private testService: TestService, private skillService: SkillService) {}

  @Input() student: Student;
  class: Class;
  skills: Skill[];
  tests: Test[];
  lineChartData: ChartData;
  lineChartOptions: any = {
    responsive: true,
    spanGaps: true
  };
  lineChartLabels: String[];

  async ngOnChanges() {
    this.class = await this.classService.getClass(this.student.classID);
    this.tests = await this.testService.getTests(this.student.classID);

    let allSkillsId: String[] = [];
    _.forEach(this.tests, test => {
      _.forEach(test.skills, skill => allSkillsId.push(skill.skillID));
    });

    allSkillsId = _.uniq(allSkillsId);

    this.skills = [];

    for (const skillId of allSkillsId) {
      const curSkill = await this.skillService.getSkill(skillId);
      this.skills.push(curSkill);
    }

    this._loadChartData();
    console.log(this.lineChartData.series);
  }

  private _loadChartData() {
    this.lineChartLabels = [];
    this.lineChartData = new ChartData();
    this.lineChartData.initSeries(this.skills);

    _.forEach(this.tests, test => this._loadTestInChartData(test));
  }

  private _loadTestInChartData(test: Test) {
    const testResult = _.find(test.results, result => result.studentID === this.student.id);

    this.lineChartLabels.push(test.name);

    _.forEach(this.skills, skill => {
      if (!this._isSkillInTest(skill, testResult.notes)) {
        this.lineChartData.addPoint(NaN, skill.longName);
      } else if (this._hasStudentMissedTest(testResult.notes)) {
        // add NaN for current skill
        this.lineChartData.addPoint(NaN, skill.longName);
      } else {
        const note = _.find(testResult.notes, testNote => testNote.skillID === skill.id).skillNote;
        this.lineChartData.addPoint(note, skill.longName);
      }
    });
  }

  private _hasStudentMissedTest(testNotes: TestNote[]): boolean {
    let hasMissed = false;
    if (_.findIndex(testNotes, testNote => _.isNull(testNote.skillNote)) >= 0) {
      hasMissed = true;
    }

    return hasMissed;
  }

  private _isSkillInTest(skill: Skill, testNotes: TestNote[]): boolean {
    let inTest = false;

    if (_.findIndex(testNotes, testNote => testNote.skillID === skill.id) >= 0) {
      inTest = true;
    }

    return inTest;
  }

  // private _loadChartData() {
  //   this.lineChartData = new ChartData();
  //
  //   for (const test of this.tests) {
  //     this._loadTestInChartData(test);
  //   }
  // }
  //
  // private _loadTestInChartData(test: Test) {
  //   const testResult = _.find(test.results, result => result.studentID === this.student.id);
  //
  //   for (const testNote of testResult.notes) {
  //     const curSkill = _.find(this.skills, skill => skill.id === testNote.skillID);
  //
  //     this.lineChartData.addPoint(testNote.skillNote, curSkill.longName);
  //   }
  // }

  private _calculatePercent(note: number, max: number): number {
    return Math.round(1000 * note / max) / 10;
  }
}
