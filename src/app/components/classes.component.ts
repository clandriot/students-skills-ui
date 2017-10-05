import { Component, OnInit } from '@angular/core';

import { Class } from './class/class';
import { ClassService } from './class/class.service';

@Component({
  selector: 'ssi-classes',
  templateUrl: 'classes.component.html',
  styleUrls: ['classes.component.css']
})
export class ClassesComponent implements OnInit {
  classes: Class[];

  constructor(private classService: ClassService) {  }

  ngOnInit() {
    this.getClasses();
  }

  getClasses(): void {
    this.classService.getClasses().then(classes => this.classes = classes);
  }
}
