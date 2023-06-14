import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModel, InferModeFromModel, Replace } from 'ngx-mf';
import { TimeEntry } from '../../../services/time-tracking/time.entry';
import { formatISO, getUnixTime, parseISO } from 'date-fns';

type EntryModel = FormModel<
    TimeEntry,
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
    @Output() timeEntry = new EventEmitter<TimeEntry>();

    protected readonly maximumDate = formatISO(new Date(), { representation: 'date' });
    private readonly formBuilder = inject(FormBuilder);
    protected formGroup = this.formBuilder.group<EntryModel['controls']>({
        start: new FormControl<string>('', { nonNullable: true }),
        utcDate: new FormControl<string>(formatISO(new Date(), { representation: 'date' }), { nonNullable: true }),
        end: new FormControl<string>('', { nonNullable: true }),
    });

    submit(): void {
        if (!this.formGroup.valid) {
            return;
        }

        const formValue = { ...(this.formGroup.value as Required<EntryModel['value']>) };

        this.timeEntry.emit({
            utcDate: getUnixTime(parseISO(formValue.utcDate)),
            start: this.parseTime(formValue.start),
            end: this.parseTime(formValue.end),
        });
    }

    private parseTime(time: string): number {
        const [hours, minutes] = time.split(':');

        return getUnixTime(new Date(0, 0, 0, +hours, +minutes));
    }
}
