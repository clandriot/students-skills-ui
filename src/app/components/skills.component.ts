import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { Skill } from './skill/skill';
import { SkillService } from './skill/skill.service';
import { SkillEditComponent } from './skill/skill-edit.component';
import { ConfirmComponent } from './misc/confirm.component';

import * as _ from 'lodash';

@Component({
  selector: 'ssi-skills',
  templateUrl: 'skills.component.html',
  styleUrls: ['skills.component.css']
})
export class SkillsComponent implements OnInit {
  skills: Skill[];

  constructor(private skillService: SkillService, private router: Router, private dialog: MdDialog) {  }

  async ngOnInit() {
    this.skills = await this.skillService.getSkills();
  }

  deleteSkill(skill: Skill): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      role: 'alertdialog'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result.confirm === true) {
        await this.skillService.deleteSkill(skill);
        this.skills.splice(this.skills.findIndex((curSkill) => curSkill.id === skill.id), 1);
      }
    });
  }

  openEditDialog(skill: Skill): void {
    const skillBkp = _.cloneDeep(skill);
    const dialogRef = this.dialog.open(SkillEditComponent, {
      data: skill
    });

    dialogRef.afterClosed().subscribe(async updatedSkill => {
      if (updatedSkill && updatedSkill.shortName !== '' && updatedSkill.longtName !== '') {
        await this.skillService.updateSkill(updatedSkill);
      } else {
        skill.shortName = skillBkp.shortName;
        skill.longName = skillBkp.longName;
        skill.description = skillBkp.description;
      }
    });
  }

  createSkill(): void {
    const dialogRef = this.dialog.open(SkillEditComponent, {
      data: {shortName: '', longName: '', description: ''}
    });

    dialogRef.afterClosed().subscribe(async newSkill => {
      if (newSkill &&
         newSkill.shortName &&
         newSkill.shortName !== '' &&
         newSkill.longName &&
         newSkill.longName !== '' &&
         newSkill.description) {
        const createdSkill = await this.skillService.createSkill(newSkill.shortName, newSkill.longName, newSkill.description);
        this.skills.push(createdSkill);
      }
    });
  }
}
