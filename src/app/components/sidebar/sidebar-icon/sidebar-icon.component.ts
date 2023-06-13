import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
    selector: 'kw-sidebar-icon',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './sidebar-icon.component.html',
    styleUrls: ['./sidebar-icon.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarIconComponent {
    @Input({ required: true }) icon!: IconProp;
}
