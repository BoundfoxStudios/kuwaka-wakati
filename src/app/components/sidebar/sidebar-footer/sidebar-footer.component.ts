import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'kw-sidebar-footer',
    standalone: true,
    imports: [],
    templateUrl: './sidebar-footer.component.html',
    styleUrls: ['./sidebar-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarFooterComponent {}
