import * as _ from 'lodash';

import { Component, Input, OnChanges } from '@angular/core';

import { Student } from '../student/student';
import { Class } from '../class/class';
import { ClassService } from '../class/class.service';
import { Skill } from '../skill/skill';
import { SkillService } from '../skill/skill.service';
import { Test } from '../test/test';
import { TestService } from '../test/test.service';


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

  async ngOnChanges() {
    console.log(this.student);
    this.class = await this.classService.getClass(this.student.classID);
    this.tests = await this.testService.getTests(this.student.classID);

    let allSkillsId: String[] = [];
    _.forEach(this.tests, test => {
      _.forEach(test.skills, skill => allSkillsId.push(skill.skillID));
    });

    allSkillsId = _.uniq(allSkillsId);

    this.skills = [];
    _.forEach(allSkillsId, async skillID => this.skills.push(await this.skillService.getSkill(skillID)));

    console.log(this.skills);
  }
}
