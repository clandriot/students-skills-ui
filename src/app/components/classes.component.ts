import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';

import { Class } from './class/class';
import { ClassService } from './class/class.service';
import { ClassEditComponent } from './class/class-edit.component';
import { ConfirmComponent } from './misc/confirm.component';

import * as _ from 'lodash';

@Component({
  selector: 'ssi-classes',
  templateUrl: 'classes.component.html',
  styleUrls: ['classes.component.css']
})
export class ClassesComponent implements OnInit {
  classes: Class[];

  constructor(private classService: ClassService, private router: Router, private dialog: MdDialog) {  }

  async ngOnInit() {
    this.classes = await this.classService.getClasses();
  }

  goToDetails(selectedClass: Class): void {
    this.router.navigate(['/class', selectedClass.id]);
  }

  deleteClass(selectedClass: Class): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      role: 'alertdialog'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result.confirm === true) {
        await this.classService.deleteClass(selectedClass);
        this.classes.splice(this.classes.findIndex((curClass) => curClass.id === selectedClass.id), 1);
      }
    });
  }

  openEditDialog(selectedClass: Class): void {
    const classBkp = _.cloneDeep(selectedClass);
    const dialogRef = this.dialog.open(ClassEditComponent, {
      data: selectedClass
    });

    dialogRef.afterClosed().subscribe(async updatedClass => {
      if (updatedClass && updatedClass.name !== '') {
        await this.classService.updateClass(updatedClass);
      } else {
        selectedClass.name = classBkp.name;
      }
    });
  }

  createClass(): void {
    const dialogRef = this.dialog.open(ClassEditComponent, {
      data: {name: ''}
    });

    dialogRef.afterClosed().subscribe(async newClass => {
      if (newClass && newClass.name && newClass.name !== '') {
        const createdClass = await this.classService.createClass(newClass.name);
        this.classes.push(createdClass);
      }
    });
  }
}
