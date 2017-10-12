import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MdDialog } from '@angular/material';
import { MdSlideToggleChange } from '@angular/material';

import 'rxjs/add/operator/map';

import { ClassService } from './class.service';

import { StudentService } from '../student/student.service';
import { Student } from '../student/student';
import { ConfirmComponent } from '../misc/confirm.component';
import { StudentEditComponent } from '../student/student-edit.component';

import { Class } from './class';

import { Skill } from '../skill/skill';
import { SkillService } from '../skill/skill.service';

import * as _ from 'lodash';

@Component({
  selector: 'ssi-class',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})

export class ClassDetailsComponent implements OnInit {

  classId: String;
  class: Class;
  className: String;
  students: Student[];
  skills: Skill[];

  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private skillService: SkillService,
    private route: ActivatedRoute,
    private dialog: MdDialog) {}

  async ngOnInit() {
    this.route.params.map(param => param.id).subscribe(id => this.classId = id);
    this.class = await this.classService.getClass(this.classId);
    this.className = this.class.name;
    this.students = await this.studentService.getStudents(this.classId);
    this.skills = await this.skillService.getSkills();
  }

  deleteStudent(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      role: 'alertdialog'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result.confirm === true) {
        await this.studentService.deleteStudent(student);
        this.students.splice(this.students.findIndex((curStudent) => curStudent.id === student.id), 1);
      }
    });
  }

  createStudent(): void {
    const dialogRef = this.dialog.open(StudentEditComponent, {
      data: {firstName: '', lastName: ''}
    });

    dialogRef.afterClosed().subscribe(async newStudent => {
      if (newStudent && newStudent.firstName && newStudent.firstName !== '' && newStudent.lastName && newStudent.lastName !== '') {
        const createdStudent = await this.studentService.createStudent(this.classId, newStudent.firstName, newStudent.lastName);
        this.students.push(createdStudent);
      }
    });
  }

  openEditDialog(student: Student): void {
    const studentBkp = _.cloneDeep(student);
    const dialogRef = this.dialog.open(StudentEditComponent, {
      data: student
    });

    dialogRef.afterClosed().subscribe(async updatedStudent => {
      if (updatedStudent && updatedStudent.firstName !== '' && updatedStudent.lastName !== '') {
        await this.studentService.updateStudent(updatedStudent);
      } else {
        student.firstName = studentBkp.firstName;
        student.lastName = studentBkp.lastName;
      }
    });
  }

  async onSlideChange(event: MdSlideToggleChange, skill: Skill): Promise<void> {
    if (event.checked === true) {
      if (_.isUndefined(this.class.defaultSkills)) {
        this.class.defaultSkills = [];
      }
      this.class.defaultSkills.push({skillID: skill.id});
    } else {
      this.class.defaultSkills.splice(_.findIndex(this.class.defaultSkills, item => {
        return item.skillID === skill.id;
      }), 1);
    }

    await this.classService.updateClass(this.class);
  }

  isDefault(skill: Skill): boolean {
    const exist = _.findIndex(this.class.defaultSkills, current => {
      return current.skillID === skill.id;
    }) >= 0;

    return exist;
  }
}
