import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'kw-sidebar-header',
    standalone: true,
    imports: [],
    templateUrl: './sidebar-header.component.html',
    styleUrls: ['./sidebar-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarHeaderComponent {
    @Input() image?: string;
}
