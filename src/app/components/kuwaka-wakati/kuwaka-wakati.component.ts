import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidebarItemComponent } from '../sidebar/sidebar-item/sidebar-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDashboard, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { SidebarIconComponent } from '../sidebar/sidebar-icon/sidebar-icon.component';

@Component({
    selector: 'kw-kuwaka-wakati',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        SidebarItemComponent,
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
    protected readonly faDashboard = faDashboard;
    protected readonly faDatabase = faDatabase;
}
