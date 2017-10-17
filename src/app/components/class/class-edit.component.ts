import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ssi-class-edit',
  templateUrl: 'class-edit.component.html',
  styleUrls: ['class-edit.component.css']
})
export class ClassEditComponent {
  classNameValidator = new FormControl('', [
    Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<ClassEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
