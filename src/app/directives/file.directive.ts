import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'input[type="file"]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FileDirective,
            multi: true,
        },
    ],
})
export class FileDirective implements ControlValueAccessor {
    private readonly hostElement = inject<ElementRef<HTMLInputElement>>(ElementRef);

    private onChange?: (file: File | null) => void;

    @HostListener('change', ['$event.target.files'])
    private emitFiles(event: FileList): void {
        const file = event && event.item(0);

        if (this.onChange) {
            this.onChange(file);
        }
    }

    registerOnChange(fn: (file: File | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(): void {
        // Empty.
    }

    writeValue(): void {
        this.hostElement.nativeElement.value = '';
    }
}
