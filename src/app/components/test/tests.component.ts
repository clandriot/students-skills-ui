import * as _ from 'lodash';
import * as moment from 'moment';

import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Class } from '../class/class';
import { ClassService } from '../class/class.service';
import { Skill } from '../skill/skill';
import { SkillService } from '../skill/skill.service';
import { Test } from './test';
import { SkillScore } from './test';
import { SkillSelection } from './test';
import { TestService } from './test.service';

import { ConfirmComponent } from '../misc/confirm.component';
import { TestEditComponent } from './test-edit.component';


@Component({
  selector: 'ssi-tests',
  templateUrl: 'tests.component.html',
  styleUrls: ['tests.component.css']
})
export class TestsComponent implements OnInit {
  private classId: String;
  private tests: Test[];

  constructor(private route: ActivatedRoute,
    private testService: TestService,
    private classService: ClassService,
    private skillService: SkillService,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.route.params.map(param => param.id).subscribe(id => {
      this.classId = id;
      this.updateTests();
    });
  }

  getFormattedDate(test: Test): String {
    return moment(test.date).format('dddd DD MMMM YYYY');
  }

  async updateTests() {
    this.tests = await this.testService.getTests(this.classId);
  }

  deleteTest(test: Test): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      role: 'alertdialog'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result.confirm === true) {
        await this.testService.deleteTest(test);
        this.tests.splice(this.tests.findIndex((curTest) => curTest.id === test.id), 1);
      }
    });
  }

  async createTest(): Promise<void> {
    const allSkills = await this.skillService.getSkills();
    const curClass = await this.classService.getClass(this.classId);
    const defaultSkills = curClass.defaultSkills;
    const selectedSkills: SkillSelection[] = [];
    let skillSelectionStore: SkillSelectionStore;
    let skillSelectionDataSource: SkillSelectionDataSource;

    _.forEach(allSkills, (skill) => {
      let selected = false;
      if (_.findIndex(defaultSkills, (defaultSkill) => defaultSkill.skillID === skill.id) >= 0) {
        selected = true;
      }
      selectedSkills.push({
        skillScore: {
          skillID: skill.id,
          scoringScale: 0
        },
        shortName: skill.shortName,
        selected: selected
      });
    });

    skillSelectionStore = new SkillSelectionStore(selectedSkills);
    skillSelectionDataSource = new SkillSelectionDataSource(skillSelectionStore);

    const dialogRef = this.dialog.open(TestEditComponent, {
      data: {name: '', description: '', date: new Date(), skillSelection: skillSelectionDataSource}
    });

    dialogRef.afterClosed().subscribe(async data => {
      if (data && data.skillSelection) {
        const skillSelection = data.skillSelection.connect().value;
        console.log(skillSelection);

        if (data.name && data.name !== '' &&
              data.description && data.description !== '' &&
              data.date &&
              skillSelection && skillSelection.length > 0 ) {
          const skillScores: SkillScore[] = [];
          _.forEach(skillSelection, (skill: SkillSelection) => {
            if ( skill.selected) {
              skillScores.push({
                skillID: skill.skillScore.skillID,
                scoringScale: skill.skillScore.scoringScale});
            }
          });

          const createdTest = await this.testService.createTest(this.classId, data.name, data.date, data.description, skillScores);
          this.tests.push(createdTest);
        }
      }
    });
  }
}

export class SkillSelectionStore {
  dataChange: BehaviorSubject<SkillSelection[]> = new BehaviorSubject<SkillSelection[]>([]);

  constructor(skillSelection) {
    this.dataChange.next(skillSelection);
  }

  get data(): SkillSelection[] {
    return this.dataChange.value;
  }
}

export class SkillSelectionDataSource extends DataSource<any> {
  constructor(private skillSelectionStore: SkillSelectionStore) {
    super();
  }

  connect(): Observable<SkillSelection[]> {
    return this.skillSelectionStore.dataChange;
  }

  disconnect() {}
}
