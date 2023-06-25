import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTable } from '../../services/settings/settings.table';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatabaseService } from '../../services/database/database.service';
import { DateTime } from 'luxon';
import { dateTimeToLocaleData } from '../../services/time.utils';
import { FileDirective } from '../../directives/file.directive';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import { CardComponent } from '../card/card.component';
import { CardSectionTitleComponent } from '../card/card-section-title/card-section-title.component';
import { Settings } from '../../services/settings/settings';

@Component({
    selector: 'kw-settings',
    standalone: true,
    imports: [CommonModule, SettingsFormComponent, PageTitleComponent, FileDirective, ReactiveFormsModule, CardComponent, CardSectionTitleComponent],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {
    protected readonly fileControl = new FormControl<File | null>(null, { validators: [Validators.required] });
    private readonly databaseService = inject(DatabaseService);
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings = toSignal(this.settingsTable.current$);
    private readonly tauriService = inject(TauriService);

    protected async export(): Promise<void> {
        const blob = await this.databaseService.exportToBlob();
        await this.tauriService.save(blob, `KuwakaWakati-${dateTimeToLocaleData(DateTime.now())}.json`);
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
