import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Settings } from '../../../services/settings/settings';
import { FormModel, Replace } from 'ngx-mf';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Duration } from 'luxon';
import { DurationPipe } from '../../../pipes/duration.pipe';
import { map, publish, shareReplay, startWith, tap } from 'rxjs';
import { dailyWorkAsWeek, durationToHumanReadable, millisecondsToHumanReadable, parseTimeToDuration } from '../../../services/time.utils';
import { toSignal } from '@angular/core/rxjs-interop';

type SettingsModel = FormModel<
    Settings,
    {
        workPerDay: Replace<FormControl<string>>;
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
    private readonly formBuilder = inject(FormBuilder);
    protected formGroup = this.formBuilder.group<SettingsModel['controls']>({
        workPerDay: new FormControl<string>('', { nonNullable: true }),
    });
    private readonly workPerDay = toSignal(this.formGroup.controls.workPerDay.valueChanges, { initialValue: 'hh:mm' });
    protected readonly workHoursPerWeek = computed(() => {
        const workPerDay = this.workPerDay();
        return dailyWorkAsWeek(parseTimeToDuration(workPerDay));
    });

    ngOnInit(): void {
        this.formGroup.setValue({
            workPerDay: millisecondsToHumanReadable(this.settings.workPerDay),
        });
    }
}
