import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ssi-student-edit',
  templateUrl: 'student-edit.component.html',
  styleUrls: ['student-edit.component.css']
})
export class StudentEditComponent {
  requiredValidator = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MdDialogRef<StudentEditComponent>,
  @Inject(MD_DIALOG_DATA) public data: any) {  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
