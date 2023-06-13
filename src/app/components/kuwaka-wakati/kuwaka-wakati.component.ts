import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'kw-kuwaka-wakati',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent],
    templateUrl: './kuwaka-wakati.component.html',
    styleUrls: ['./kuwaka-wakati.component.css'],
    encapsulation: ViewEncapsulation.ShadowDom,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KuwakaWakatiComponent {}
