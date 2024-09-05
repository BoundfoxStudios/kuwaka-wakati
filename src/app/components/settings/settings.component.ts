import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTable } from '../../services/settings/settings.table';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { DatabaseService } from '../../services/database/database.service';
import { DateTime } from 'luxon';
import { dateTimeToLocaleData, millisecondsToHumanReadable } from '../../services/time.utils';
import { FileDirective } from '../../directives/file.directive';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import { CardComponent } from '../card/card.component';
import { CardSectionTitleComponent } from '../card/card-section-title/card-section-title.component';
import { Settings } from '../../services/settings/settings';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { TimeTable } from '../../services/time-tracking/time.table';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'kw-settings',
    standalone: true,
    imports: [
        CommonModule,
        SettingsFormComponent,
        PageTitleComponent,
        FileDirective,
        ReactiveFormsModule,
        CardComponent,
        CardSectionTitleComponent,
        LoadingSpinnerComponent,
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {
    protected readonly fileControl = new FormControl<File | null>(null, { validators: [Validators.required] });
    private readonly databaseService = inject(DatabaseService);
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings$ = this.settingsTable.current$;
    private readonly tauriService = inject(TauriService);
    private readonly timeTable = inject(TimeTable);

    protected async export(): Promise<void> {
        const blob = await this.databaseService.exportToBlob();
        await this.tauriService.save(blob, `KuwakaWakati-${dateTimeToLocaleData(DateTime.now())}.json`);
    }

    protected async exportCSV(days: number): Promise<void> {
        const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const startDay = today.minus({ day: days });
        const items = await firstValueFrom(this.timeTable.groupByDay$(startDay.toMillis(), today.toMillis()));
        const rows = [
            ['Date', 'Start Time', 'End Time', 'Duration', 'Duration (float)', 'Is A Day Off?', 'Is a non work day?', 'description'],
            ...items.flatMap(item => [
                ...item.items.map(timeEntry => [
                    DateTime.fromMillis(item.utcDate).toISODate(),
                    DateTime.fromMillis(timeEntry.start).toISOTime({
                        includeOffset: false,
                        includePrefix: false,
                        suppressMilliseconds: true,
                        suppressSeconds: true,
                        extendedZone: false,
                    }),
                    DateTime.fromMillis(timeEntry.end).toISOTime({
                        includeOffset: false,
                        includePrefix: false,
                        suppressMilliseconds: true,
                        suppressSeconds: true,
                        extendedZone: false,
                    }),
                    millisecondsToHumanReadable(timeEntry.duration.toMillis()),
                    timeEntry.duration.shiftTo('hours').hours,
                    timeEntry.isADayOff,
                    timeEntry.isNonWorkday,
                    timeEntry.description,
                ]),
            ]),
        ];

        const csv = rows.map(row => row.join(',')).join('\n');
        const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        await this.tauriService.save(csvBlob, `KuwakaWakati-${days}days-${dateTimeToLocaleData(DateTime.now())}.csv`);
    }

    protected async import(): Promise<void> {
        if (!this.fileControl.value) {
            return;
        }

        const confirm = await this.tauriService.confirm(
            'Do you really want to import? Database will be cleared and freshly imported with your selected data.',
        );

        if (!confirm) {
            return;
        }

        const { value } = this.fileControl;
        if (!value) {
            return;
        }

        await this.databaseService.importFromBlob(value);
        window.location.reload();
    }

    protected async clear(): Promise<void> {
        const confirm = await this.tauriService.confirm('Do you really want to clear the whole database? Everything will be deleted!');

        if (!confirm) {
            return;
        }

        await this.databaseService.clear();
        window.location.reload();
    }

    protected async updateSettings(settings: Settings): Promise<void> {
        await this.settingsTable.update(settings);
    }
}
