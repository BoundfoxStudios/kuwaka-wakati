import { AbstractControl, ValidatorFn } from '@angular/forms';
import { parseTimeToDuration } from '../services/time.utils';

export const validateTime: ValidatorFn = (control: AbstractControl<string> | undefined) =>
    control?.value && parseTimeToDuration(control.value).isValid ? null : { invalidTime: true };
