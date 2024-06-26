import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModel, Replace } from 'ngx-mf';
import { TimeEntryCreate, TimeEntryDescriptions } from '../../../services/time-tracking/time.models';
import { DateTime } from 'luxon';
import { validateTime } from '../../../validators/validate-time';
import { millisecondsToHumanReadable, parseTime } from '../../../services/time.utils';
import { validateStartEndGroup } from '../../../validators/validate-start-end-time-group';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Settings } from '../../../services/settings/settings';
import { KeyValuePipe } from '@angular/common';

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
    imports: [FormsModule, ReactiveFormsModule, KeyValuePipe],
    templateUrl: './time-entry.component.html',
    styleUrls: ['./time-entry.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeEntryComponent implements OnInit {
    /**
     * Enabled the today mode hides the date entry.
     */
    @Input() isTodayMode = false;
    @Input({ required: true }) settings!: Settings;
    @Output() timeEntry = new EventEmitter<TimeEntryCreate>();

    protected readonly TimeEntryDescriptions = TimeEntryDescriptions;
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
            description: new FormControl<string>(TimeEntryDescriptions[0], { nonNullable: true }),
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

    ngOnInit(): void {
        if (this.isTodayMode && this.settings.preFillEndTime) {
            this.formGroup.controls.end.setValue(DateTime.now().toFormat('HH:mm'));
        }
    }

    submit(): void {
        if (!this.formGroup.valid) {
            return;
        }

        const formValue = this.formGroup.value;

        this.timeEntry.emit({
            utcDate: DateTime.fromISO(formValue.utcDate!).toMillis(),
            start: parseTime(formValue.start ?? '00:00'),
            end: parseTime(formValue.end ?? millisecondsToHumanReadable(this.settings.workPerDay)),
            isNonWorkday: formValue.isNonWorkday!,
            isADayOff: formValue.isADayOff!,
            description: formValue.description!,
        });

        this.formGroup.reset(this.formInitialState);
    }
}
