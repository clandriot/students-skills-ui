import { Component, Input } from '@angular/core';

@Component({
  selector: 'ssi-page-header',
  templateUrl: 'page-header.component.html',
  styleUrls: ['page-header.component.css']
})
export class PageHeaderComponent {
  @Input() title: String;
}
