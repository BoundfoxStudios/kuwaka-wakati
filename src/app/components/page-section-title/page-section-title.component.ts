import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-page-section-title',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-section-title.component.html',
    styleUrls: ['./page-section-title.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSectionTitleComponent {}
