import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormModel, InferModeFromModel, Replace } from 'ngx-mf';
import { TimeEntryCreate } from '../../../services/time-tracking/time.entry';
import { DateTime } from 'luxon';

type EntryModel = FormModel<
    TimeEntryCreate,
    {
        utcDate: Replace<FormControl<string>>;
        start: Replace<FormControl<string>>;
        end: Replace<FormControl<string>>;
    },
    InferModeFromModel
>;

const parseTime = (time: string): number => DateTime.fromFormat(time, 'HH:mm').toMillis();

const validateStartEnd: ValidatorFn = (control: AbstractControl) => {
    const startControl = control.get('start') as AbstractControl<string>;
    const endControl = control.get('end') as AbstractControl<string>;

    if (!startControl || !endControl) {
        return null;
    }

    const start = parseTime(startControl.value);
    const end = parseTime(endControl.value);

    return start > end ? { startGreaterThanEnd: true } : null;
};

const validateTime: ValidatorFn = (control: AbstractControl<string>) => (isNaN(parseTime(control.value)) ? { invalidTime: true } : null);

@Component({
    selector: 'kw-time-entry',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './time-entry.component.html',
    styleUrls: ['./time-entry.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeEntryComponent {
    @Output() timeEntry = new EventEmitter<TimeEntryCreate>();

    protected readonly maximumDate = DateTime.now().toISODate();
    private readonly formBuilder = inject(FormBuilder);
    protected formGroup = this.formBuilder.group<EntryModel['controls']>(
        {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            utcDate: new FormControl<string>(DateTime.now().toISODate()!, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            start: new FormControl<string>('', { nonNullable: true, validators: [validateTime] }),
            end: new FormControl<string>('', { nonNullable: true, validators: [validateTime] }),
        },
        { validators: [validateStartEnd] },
    );

    submit(): void {
        if (!this.formGroup.valid) {
            return;
        }

        const formValue = { ...(this.formGroup.value as Required<EntryModel['value']>) };

        this.timeEntry.emit({
            utcDate: DateTime.fromISO(formValue.utcDate).toMillis(),
            start: parseTime(formValue.start),
            end: parseTime(formValue.end),
        });
    }
}
