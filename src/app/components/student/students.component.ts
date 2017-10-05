import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Student } from './student';
import { Class } from '../class/class';
import { StudentService } from './student.service';

@Component({
  selector: 'ssi-students',
  templateUrl: 'students.component.html',
  styleUrls: ['students.component.css']
})
export class StudentsComponent implements OnInit {
  private students: Student[];

  constructor(private studentService: StudentService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) =>
      this.studentService.getStudents(params.get('id'))).subscribe(students => this.students = students);
  }
}
