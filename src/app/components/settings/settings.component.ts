import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTable } from '../../services/settings/settings.table';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatabaseService } from '../../services/database/database.service';
import { DateTime } from 'luxon';
import { dateTimeToLocaleData } from '../../services/time.utils';
import { PageSectionTitleComponent } from '../page-section-title/page-section-title.component';
import { FileDirective } from '../../directives/file.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';

@Component({
    selector: 'kw-settings',
    standalone: true,
    imports: [CommonModule, SettingsFormComponent, PageTitleComponent, PageSectionTitleComponent, FileDirective, ReactiveFormsModule],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {
    protected readonly fileControl = new FormControl<File | null>(null);
    private readonly databaseService = inject(DatabaseService);
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings = toSignal(this.settingsTable.current$, { requireSync: true });
    private readonly tauriService = inject(TauriService);

    protected async export(): Promise<void> {
        const blob = await this.databaseService.exportToBlob();
        await this.tauriService.save(blob, `KuwakaWakati-${dateTimeToLocaleData(DateTime.now())}.json`);
    }

    protected async import(): Promise<void> {
        const { value } = this.fileControl;
        if (!value) {
            return;
        }

        await this.databaseService.importFromBlob(value);
        window.location.reload();
    }

    protected async clear(): Promise<void> {
        await this.databaseService.clear();
        window.location.reload();
    }
}
