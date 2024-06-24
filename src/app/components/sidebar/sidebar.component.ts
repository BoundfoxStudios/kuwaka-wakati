import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'kw-sidebar',
    standalone: true,
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}
