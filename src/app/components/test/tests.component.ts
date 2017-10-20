import * as _ from 'lodash';
import * as moment from 'moment';

import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Class } from '../class/class';
import { ClassService } from '../class/class.service';
import { Student } from '../student/student';
import { StudentService } from '../student/student.service';
import { Skill } from '../skill/skill';
import { SkillService } from '../skill/skill.service';
import { Test, TestNote } from './test';
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
  tests: Test[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private classService: ClassService,
    private skillService: SkillService,
    private studentService: StudentService,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.route.params.map(param => param.id).subscribe(id => {
      this.classId = id;
      this.updateTests();
    });
  }

  getFormattedDate(test: Test): String {
    return moment(test.date).locale('fr-FR').format('dddd DD MMMM YYYY');
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

  goToTestResults(test: Test): void {
    this.router.navigateByUrl('/notes/' + test.id);
  }

  async addEmptyResults(test: Test): Promise<Test> {
    const students: Student[] = await this.studentService.getStudents(this.classId);

    test.results = [];
    const defaultNotes: TestNote[] = [];
    _.forEach(test.skills, skill => defaultNotes.push({skillID: skill.skillID, skillNote: 0} as TestNote));
    _.forEach(students, student => test.results.push({studentID: student.id, notes: defaultNotes}));

    return test;
  }

  updateTestResults(test: Test, newSkillScores: SkillScore[]): Test {
    const removedSkills = _.differenceWith(test.skills, newSkillScores,
      (arrValue: SkillScore, othValue: SkillScore) => arrValue.skillID === othValue.skillID);
    const addedSkills = _.differenceWith(newSkillScores, test.skills,
      (arrValue: SkillScore, othValue: SkillScore) => arrValue.skillID === othValue.skillID);

    if (removedSkills.length > 0) {
      _.forEach(test.results, result => {
        _.pullAllWith(result.notes, removedSkills, (arrValue: TestNote, othValue: SkillScore) => arrValue.skillID === othValue.skillID);
      });
    }
    if (addedSkills.length > 0) {
      console.log('in');
      _.forEach(test.results, result => {
        console.log(result);
        _.forEach(addedSkills, addedSkill => result.notes.push({skillID: addedSkill.skillID, skillNote: 0} as TestNote));
      });
    }

    return test;
  }

  async updateTest(test: Test): Promise<void> {
    const allSkills = await this.skillService.getSkills();
    const curClass = await this.classService.getClass(this.classId);
    const selectedSkills: SkillSelection[] = [];
    let skillSelectionStore: SkillSelectionStore;
    let skillSelectionDataSource: SkillSelectionDataSource;

    _.forEach(allSkills, (skill) => {
      let selected = false;
      const testSkill: SkillScore = _.find(test.skills, (currentElem) => currentElem.skillID === skill.id) as SkillScore;
      let scoringScale = 0;
      if ( !_.isUndefined(testSkill)) {
        selected = true;
        scoringScale = testSkill.scoringScale;
      }
      selectedSkills.push({
        skillScore: {
          skillID: skill.id,
          scoringScale: scoringScale
        },
        shortName: skill.shortName,
        selected: selected
      });
    });

    skillSelectionStore = new SkillSelectionStore(selectedSkills);
    skillSelectionDataSource = new SkillSelectionDataSource(skillSelectionStore);

    const testBkp = _.cloneDeep(test);
    const dialogRef = this.dialog.open(TestEditComponent, {
      data: {test: test, skillSelection: skillSelectionDataSource}
    });

    dialogRef.afterClosed().subscribe(async data => {
      if (data && data.skillSelection) {
        const skillSelection = data.skillSelection.connect().value;

        if (data.test.name && data.test.name !== '' &&
              data.test.description && data.test.description !== '' &&
              data.test.date &&
              skillSelection && skillSelection.length > 0 ) {
          const skillScores: SkillScore[] = [];
          _.forEach(skillSelection, (skill: SkillSelection) => {
            if ( skill.selected) {
              skillScores.push({
                skillID: skill.skillScore.skillID,
                scoringScale: skill.skillScore.scoringScale});
            }
          });

          test = this.updateTestResults(test, skillScores);
          test.skills = skillScores;
          await this.testService.updateTest(test);
        }
      } else {
        // test = testBkp;
        test.name = testBkp.name;
        test.description = testBkp.description;
        test.date = testBkp.date;
        test.skills = testBkp.skills;
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
    let test: Test = new Test();
    test.classID = this.classId;
    test.name = '';
    test.date = new Date();
    test.description = '';
    test.skills = [] as SkillScore[];

    const dialogRef = this.dialog.open(TestEditComponent, {
      data: {test: test, skillSelection: skillSelectionDataSource}
    });

    dialogRef.afterClosed().subscribe(async data => {
      if (data && data.skillSelection) {
        const skillSelection = data.skillSelection.connect().value;

        if (data.test.name && data.test.name !== '' &&
              data.test.description && data.test.description !== '' &&
              data.test.date &&
              skillSelection && skillSelection.length > 0 ) {

          _.forEach(skillSelection, (skill: SkillSelection) => {
            if ( skill.selected) {
              data.test.skills.push({
                skillID: skill.skillScore.skillID,
                scoringScale: skill.skillScore.scoringScale});
            }
          });

          test = await this.addEmptyResults(test);
          const createdTest = await this.testService.createTest(test);
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
