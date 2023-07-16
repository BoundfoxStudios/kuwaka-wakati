import { AbstractControl, ValidatorFn } from '@angular/forms';
import { validateTime } from './validate-time';
import { parseTime } from '../services/time.utils';

type KeyOf<T> = Extract<keyof T, string>;

export const validateStartEndGroup =
    <
        TFormGroup extends {
            [key: string]: AbstractControl;
        },
    >(
        startControlName: KeyOf<TFormGroup>,
        endControlName: KeyOf<TFormGroup>,
        isADayOffControlName: KeyOf<TFormGroup>,
    ): ValidatorFn =>
    (control: AbstractControl) => {
        const startControl = control.get(startControlName) as AbstractControl<string>;
        const endControl = control.get(endControlName) as AbstractControl<string>;
        const isADayOffControl = control.get(isADayOffControlName) as AbstractControl<boolean>;

        if (isADayOffControl.value) {
            return null;
        }

        const startControlValidate = validateTime(startControl);
        const endControlValidate = validateTime(endControl);

        if (startControlValidate || endControlValidate) {
            return startControlValidate ?? endControlValidate;
        }

        const start = parseTime(startControl.value);
        const end = parseTime(endControl.value);

        return start >= end ? { startGreaterThanEnd: true } : null;
    };
