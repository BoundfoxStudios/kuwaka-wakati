import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-page-title',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {}
