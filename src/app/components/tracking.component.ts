import { Component, OnInit } from '@angular/core';

import { Class } from './class/class';
import { ClassService } from './class/class.service';
import { Student } from './student/student';
import { StudentService } from './student/student.service';

@Component({
  selector: 'ssi-tracking',
  templateUrl: 'tracking.component.html',
  styleUrls: ['tracking.component.css']
})
export class TrackingComponent implements OnInit {
  classes: Class[];
  selectedClass: Class = null;
  students: Student[];
  selectedStudent: Student = null;

  constructor(private classService: ClassService, private studentService: StudentService ) {}

  async ngOnInit() {
    this.classes = await this.classService.getClasses();
    this.students = [];
  }

  async loadStudents(selectedClass: Class) {
    this.students = await this.studentService.getStudents(selectedClass.id);
    this.selectedStudent = null;
  }
}
