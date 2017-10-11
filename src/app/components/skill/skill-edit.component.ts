import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ssi-skill-edit',
  templateUrl: 'skill-edit.component.html',
  styleUrls: ['skill-edit.component.css']
})
export class SkillEditComponent {
  requiredValidator = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MdDialogRef<SkillEditComponent>,
  @Inject(MD_DIALOG_DATA) public data: any) {  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
