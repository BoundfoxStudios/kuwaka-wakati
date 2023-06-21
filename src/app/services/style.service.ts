import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StyleService {
    private readonly document = inject(DOCUMENT);
    private readonly cache: { [key: string]: string } = {};

    getCssVariable(name: string): string {
        if (this.cache[name]) {
            return this.cache[name];
        }
        const style = getComputedStyle(this.document.body);
        this.cache[name] = style.getPropertyValue(name);
        return this.cache[name];
    }
}
