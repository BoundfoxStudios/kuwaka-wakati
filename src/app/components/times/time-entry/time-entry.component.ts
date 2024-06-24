import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModel, Replace } from 'ngx-mf';
import { TimeEntryCreate } from '../../../services/time-tracking/time.models';
import { DateTime } from 'luxon';
import { validateTime } from '../../../validators/validate-time';
import { millisecondsToHumanReadable, parseTime } from '../../../services/time.utils';
import { validateStartEndGroup } from '../../../validators/validate-start-end-time-group';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Settings } from '../../../services/settings/settings';

type EntryModel = FormModel<
    TimeEntryCreate,
    {
        utcDate: Replace<FormControl<string>>;
        start: Replace<FormControl<string>>;
        end: Replace<FormControl<string>>;
    }
>;

const changeFormControlDisable = (state: boolean, ...formControls: FormControl<unknown>[]): void => {
    if (state) {
        return formControls.forEach(formControl => formControl.disabled && formControl.enable());
    }

    if (!state) {
        return formControls.forEach(formControl => formControl.enabled && formControl.disable());
    }
};

@Component({
    selector: 'kw-time-entry',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './time-entry.component.html',
    styleUrls: ['./time-entry.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeEntryComponent {
    /**
     * Enabled the today mode hides the date entry.
     */
    @Input() isTodayMode = false;
    @Input({ required: true }) settings!: Settings;
    @Output() timeEntry = new EventEmitter<TimeEntryCreate>();

    protected readonly maximumDate = DateTime.now().toISODate();
    private readonly formBuilder = inject(FormBuilder);
    protected readonly formGroup = this.formBuilder.group<EntryModel['controls']>(
        {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            utcDate: new FormControl<string>(DateTime.now().toISODate(), {
                nonNullable: true,
                validators: [Validators.required],
            }),
            start: new FormControl<string>('', { nonNullable: true, validators: [validateTime, Validators.required] }),
            end: new FormControl<string>('', { nonNullable: true, validators: [validateTime, Validators.required] }),
            isNonWorkday: new FormControl<boolean>(false, { nonNullable: true }),
            isADayOff: new FormControl<boolean>(false, { nonNullable: true }),
        },
        { validators: [validateStartEndGroup<EntryModel['controls']>('start', 'end', 'isADayOff')] },
    );
    private readonly formInitialState = this.formGroup.value;

    constructor() {
        this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
            const formValue = value as Required<EntryModel['value']>;

            changeFormControlDisable(!formValue.isNonWorkday, this.formGroup.controls.isADayOff);
            changeFormControlDisable(
                !formValue.isADayOff,
                this.formGroup.controls.isNonWorkday,
                this.formGroup.controls.start,
                this.formGroup.controls.end,
            );
        });
    }

    submit(): void {
        if (!this.formGroup.valid) {
            return;
        }

        const formValue = this.formGroup.value;

        this.timeEntry.emit({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            utcDate: DateTime.fromISO(formValue.utcDate!).toMillis(),
            start: parseTime(formValue.start ?? '00:00'),
            end: parseTime(formValue.end ?? millisecondsToHumanReadable(this.settings.workPerDay)),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            isNonWorkday: formValue.isNonWorkday!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            isADayOff: formValue.isADayOff!,
        });

        this.formGroup.reset(this.formInitialState);
    }
}
