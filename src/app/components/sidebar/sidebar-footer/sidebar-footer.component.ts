import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-sidebar-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar-footer.component.html',
    styleUrls: ['./sidebar-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarFooterComponent {}
