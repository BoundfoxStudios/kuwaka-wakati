import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Settings } from '../../../services/settings/settings';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DurationPipe } from '../../../pipes/duration.pipe';
import { millisecondsToHumanReadable, multiplyDuration, parseTimeToDuration } from '../../../services/time.utils';
import { map } from 'rxjs';
import { FormModel, Replace } from 'ngx-mf';

type SettingsModel = FormModel<
    Omit<Settings, 'lastBackup'>,
    {
        workPerDay: Replace<FormControl<string>>;
        preFillEndTime: Replace<FormControl<boolean>>;
    }
>;

@Component({
    selector: 'kw-settings-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DurationPipe],
    templateUrl: './settings-form.component.html',
    styleUrls: ['./settings-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFormComponent implements OnInit {
    @Input({ required: true }) settings!: Settings;
    @Output() readonly settingsChange = new EventEmitter<Omit<Settings, 'lastBackup'>>();
    private readonly formBuilder = inject(FormBuilder);
    protected formGroup = this.formBuilder.group<SettingsModel['controls']>({
        workPerDay: new FormControl<string>('', { nonNullable: true }),
        preFillEndTime: new FormControl<boolean>(true, { nonNullable: true }),
    });
    protected readonly workHoursPerWeek$ = this.formGroup.controls.workPerDay.valueChanges.pipe(
        map(workPerDay => multiplyDuration(parseTimeToDuration(workPerDay))),
    );

    ngOnInit(): void {
        // Sorry :(
        // Easiest way to delay setting the data to let the component initialize first.
        void Promise.resolve().then(() =>
            this.formGroup.setValue({
                workPerDay: millisecondsToHumanReadable(this.settings.workPerDay),
                preFillEndTime: this.settings.preFillEndTime,
            }),
        );
    }

    submit(): void {
        if (this.formGroup.invalid) {
            return;
        }

        const formValue = { ...this.formGroup.value } as Required<SettingsModel['value']>;

        this.settingsChange.next({
            workPerDay: parseTimeToDuration(formValue.workPerDay).toMillis(),
            preFillEndTime: formValue.preFillEndTime,
        });
    }
}
