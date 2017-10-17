import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'ssi-confirm',
  templateUrl: 'confirm.component.html',
  styleUrls: ['confirm.component.css']
})
export class ConfirmComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmComponent>) { }
}
