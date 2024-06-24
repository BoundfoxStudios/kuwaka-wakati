import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'kw-sidebar-item',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar-item.component.html',
    styleUrls: ['./sidebar-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItemComponent {
    @Input({ required: true }) link!: string[];
}
