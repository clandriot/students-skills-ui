import { Component, Inject } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'ssi-confirm',
  templateUrl: 'confirm.component.html',
  styleUrls: ['confirm.component.css']
})
export class ConfirmComponent {
  constructor(public dialogRef: MdDialogRef<ConfirmComponent>) { }
}
