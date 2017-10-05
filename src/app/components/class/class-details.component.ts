import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/map';

import { ClassService } from './class.service';
import { StudentService } from '../student/student.service';
import { Student } from '../student/student';

@Component({
  selector: 'ssi-class',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})

export class ClassDetailsComponent implements OnInit {

  classId: String;
  className: String;
  students: Student[];

  constructor(private classService: ClassService, private studentService: StudentService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.map(param => param.id).subscribe(id => this.classId = id);
    this.classService.getClass(this.classId).then(myClass => this.className = myClass.name);
    this.studentService.getStudents(this.classId).then(students => this.students = students);
  }
}
