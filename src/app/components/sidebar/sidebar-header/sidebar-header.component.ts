import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-sidebar-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar-header.component.html',
    styleUrls: ['./sidebar-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarHeaderComponent {
    @Input() image?: string;
}
