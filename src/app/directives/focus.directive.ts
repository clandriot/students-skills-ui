import * as _ from 'lodash';

import { Directive, ElementRef, Input, AfterContentChecked } from '@angular/core';

@Directive({
  selector: '[ssiFocus]'
})
export class FocusDirective implements AfterContentChecked {
  @Input() ssiFocus: boolean;
  private element: HTMLElement;
  private hasFocused = false;

  constructor($element: ElementRef) {
    this.element = $element.nativeElement;
  }

  ngAfterContentChecked() {
    this.giveFocus();
  }

  giveFocus() {
    if (this.ssiFocus && !this.hasFocused) {
      this.element.focus();
      if (this.element instanceof HTMLInputElement) {
          this.element.select();
      }
      this.hasFocused = true;
    }
  }
}
