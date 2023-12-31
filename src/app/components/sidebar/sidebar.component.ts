import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}
