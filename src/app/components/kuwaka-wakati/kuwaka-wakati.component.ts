import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidebarItemComponent } from '../sidebar/sidebar-item/sidebar-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCogs, faDashboard, faClock, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { SidebarIconComponent } from '../sidebar/sidebar-icon/sidebar-icon.component';
import { TauriService } from '../../services/tauri.service';
import { SidebarFooterComponent } from '../sidebar/sidebar-footer/sidebar-footer.component';

@Component({
    selector: 'kw-kuwaka-wakati',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        SidebarItemComponent,
        SidebarFooterComponent,
        FontAwesomeModule,
        SidebarIconComponent,
        RouterLink,
        RouterLinkActive,
    ],
    templateUrl: './kuwaka-wakati.component.html',
    styleUrls: ['./kuwaka-wakati.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KuwakaWakatiComponent {
    private readonly tauriService = inject(TauriService);
    protected readonly version$ = this.tauriService.getVersion();

    protected readonly faDashboard = faDashboard;
    protected readonly faCogs = faCogs;
    protected readonly faClock = faClock;
    protected readonly faFileImport = faFileImport;
}
