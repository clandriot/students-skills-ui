import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Class } from './class/class';
import { ClassService } from './class/class.service';

@Component({
  selector: 'ssi-classes',
  templateUrl: 'classes.component.html',
  styleUrls: ['classes.component.css']
})
export class ClassesComponent implements OnInit {
  classes: Class[];

  constructor(private classService: ClassService, private router: Router) {  }

  ngOnInit() {
    this.getClasses();
  }

  getClasses(): void {
    this.classService.getClasses().then(classes => this.classes = classes);
  }

  goToDetails(selectedClass: Class): void {
    this.router.navigate(['/class', selectedClass.id]);
  }
}
