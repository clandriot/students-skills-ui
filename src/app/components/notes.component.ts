import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Class } from './class/class';
import { ClassService } from './class/class.service';

@Component({
  selector: 'ssi-notes',
  templateUrl: 'notes.component.html',
  styleUrls: ['notes.component.css']
})
export class NotesComponent implements OnInit {
  private classes: Class[];

  constructor(private ClassService: ClassService, private router: Router) {  }

  async ngOnInit() {
    this.classes = await this.ClassService.getClasses();
  }

  goToTests(selectedClass: Class): void {
    this.router.navigate(['/notes', {outlets: {'tests': [selectedClass.id]}}]);
  }
}
