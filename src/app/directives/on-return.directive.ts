import * as _ from 'lodash';

import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[ssiOnReturn]'
})
export class OnReturnDirective {
    private el: ElementRef;
    @Input() ssiOnReturn: string;
    constructor(private _el: ElementRef, private renderer: Renderer2) {
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
      const currentIdStr: String = currentInput.id;
      const currentId: number = Number(currentIdStr.substr('input-'.length, currentIdStr.length - 'input-'.length));

      const nextId = '#input-' + (currentId + 1);
      let nextElem: HTMLElement;

      try {
        nextElem = this.renderer.selectRootElement(nextId);
      } catch (error) {
        nextElem = this.renderer.selectRootElement('#input-0');
      }

      return nextElem;
    }
}
