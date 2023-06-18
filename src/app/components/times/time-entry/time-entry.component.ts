import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModel, InferModeFromModel, Replace } from 'ngx-mf';
import { TimeEntryCreate } from '../../../services/time-tracking/time.models';
import { DateTime } from 'luxon';
import { validateTime } from '../../../validators/validate-time';
import { parseTime } from '../../../services/time.utils';
import { validateStartEndGroup } from '../../../validators/validate-start-end-time-group';

type EntryModel = FormModel<
    TimeEntryCreate,
    {
        utcDate: Replace<FormControl<string>>;
        start: Replace<FormControl<string>>;
        end: Replace<FormControl<string>>;
    },
    InferModeFromModel
>;

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
    protected readonly formGroup = this.formBuilder.group<EntryModel['controls']>(
        {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            utcDate: new FormControl<string>(DateTime.now().toISODate()!, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            start: new FormControl<string>('', { nonNullable: true, validators: [validateTime, Validators.required] }),
            end: new FormControl<string>('', { nonNullable: true, validators: [validateTime, Validators.required] }),
        },
        { validators: [validateStartEndGroup<EntryModel['controls']>('start', 'end')] },
    );
    private readonly formInitialState = this.formGroup.value;

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

        this.formGroup.reset(this.formInitialState);
    }
}
