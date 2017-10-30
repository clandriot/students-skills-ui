import * as _ from 'lodash';

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[ssiOnReturn]'
})
export class OnReturnDirective {
    private el: ElementRef;
    @Input() ssiOnReturn: string;
    constructor(private _el: ElementRef) {
        this.el = this._el;
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        if ((e.which === 13 || e.keyCode === 13)) {
            e.preventDefault();
            const nextInput = this._findNextInput(e.srcElement);
            if (nextInput) {
                nextInput.focus();
                if (nextInput instanceof HTMLInputElement) {
                  nextInput.select();
                }
            } else {
                console.log('close keyboard');
            }
            return;
        }
    }

    private _findNextInput(currentInput: HTMLElement): HTMLElement {
      let nextInput: HTMLElement = null;

      let currentElement = currentInput.parentElement.nextElementSibling;
      let children = currentElement.children;
      while (children.length !== 1) {
        currentElement = currentElement.nextElementSibling;
        if ( _.isNull(currentElement.nextElementSibling)) {
          // reached the of a row
          if (_.isNull(currentElement.parentElement.nextElementSibling)) {
            // reached last row
            currentElement = currentElement.parentElement.parentElement.children[1].children[1];
          } else {
            currentElement = currentElement.parentElement.nextElementSibling.children[1];
          }
        } else {
          currentElement = currentElement.nextElementSibling;
        }
        children = currentElement.children;
      }

      nextInput = children[0] as HTMLElement;

      return nextInput;
    }
}
