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
    spanGaps: true,
    tooltips: {
      callbacks: {
        label: function(tooltipItem, chart) {
          return chart.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel + ' %';
        }
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
          callback: function(value, index, values) {
            return value + ' %';
          }
        }
      }]
    }
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
        const testNote = _.find(testResult.notes, curTestNote => curTestNote.skillID === skill.id);
        const percent = this._calculatePercent(testNote, test);
        this.lineChartData.addPoint(percent, skill.longName);
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

  private _calculatePercent(testNote: TestNote, test: Test): number {
    const max = _.find(test.skills, skill => skill.skillID === testNote.skillID).scoringScale;
    return Math.round(1000 * testNote.skillNote / max) / 10;
  }
}
