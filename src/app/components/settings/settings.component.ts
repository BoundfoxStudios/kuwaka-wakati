import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTable } from '../../services/settings/settings.table';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'kw-settings',
    standalone: true,
    imports: [CommonModule, SettingsFormComponent, PageTitleComponent],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings = toSignal(this.settingsTable.current$, { requireSync: true });
}
