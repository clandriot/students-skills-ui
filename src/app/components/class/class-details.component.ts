import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MdDialog } from '@angular/material';

import 'rxjs/add/operator/map';

import { ClassService } from './class.service';
import { StudentService } from '../student/student.service';
import { Student } from '../student/student';
import { ConfirmComponent } from '../misc/confirm.component';
import { StudentEditComponent } from '../student/student-edit.component';

@Component({
  selector: 'ssi-class',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})

export class ClassDetailsComponent implements OnInit {

  classId: String;
  className: String;
  students: Student[];

  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private dialog: MdDialog) {}

  ngOnInit() {
    this.route.params.map(param => param.id).subscribe(id => this.classId = id);
    this.classService.getClass(this.classId).then(myClass => this.className = myClass.name);
    this.studentService.getStudents(this.classId).then(students => this.students = students);
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

  openEditDialog(student: Student): void {
    const studentBkp = Object.assign({}, student);
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
}
