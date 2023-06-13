import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'kw-sidebar-item',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar-item.component.html',
    styleUrls: ['./sidebar-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItemComponent {
    @Input({ required: true }) link!: string[];
}
