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

  ngOnInit() {
    this.route.params.map(param => param.id).subscribe(id => this.classId = id);
    this.classService.getClass(this.classId).then(myClass => {
      this.class = myClass;
      this.className = myClass.name;
    });
    this.studentService.getStudents(this.classId).then(students => this.students = students);
    this.skillService.getSkills().then(skills => this.skills = skills);
  }

  deleteStudent(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      role: 'alertdialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm === true) {
        this.studentService.deleteStudent(student);
        this.students.splice(this.students.findIndex((curStudent) => curStudent.id === student.id));
      }
    });
  }

  createStudent(): void {
    const dialogRef = this.dialog.open(StudentEditComponent, {
      data: {firstName: '', lastName: ''}
    });

    dialogRef.afterClosed().subscribe(newStudent => {
      if (newStudent && newStudent.firstName && newStudent.firstName !== '' && newStudent.lastName && newStudent.lastName !== '') {
        this.studentService.createStudent(this.classId, newStudent.firstName, newStudent.lastName)
              .then(createdStudent => this.students.push(createdStudent));
      }
    });
  }

  openEditDialog(student: Student): void {
    const studentBkp = _.cloneDeep(student);
    const dialogRef = this.dialog.open(StudentEditComponent, {
      data: student
    });

    dialogRef.afterClosed().subscribe(updatedStudent => {
      if (updatedStudent && updatedStudent.firstName !== '' && updatedStudent.lastName !== '') {
        this.studentService.updateStudent(updatedStudent);
      } else {
        student.firstName = studentBkp.firstName;
        student.lastName = studentBkp.lastName;
      }
    });
  }

  onSlideChange(event: MdSlideToggleChange, skill: Skill): void {
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

    this.classService.updateClass(this.class);
  }

  isDefault(skill: Skill): boolean {
    const exist = _.findIndex(this.class.defaultSkills, current => {
      return current.skillID === skill.id;
    }) >= 0;

    return exist;
  }
}
