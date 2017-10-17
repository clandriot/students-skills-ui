import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DateAdapter } from '@angular/material';

@Component({
  selector: 'ssi-test-edit',
  templateUrl: 'test-edit.component.html',
})
export class TestEditComponent {
  requiredValidator = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<TestEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
