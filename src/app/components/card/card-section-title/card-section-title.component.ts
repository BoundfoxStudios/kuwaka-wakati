import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-card-section-title',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card-section-title.component.html',
    styleUrls: ['./card-section-title.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSectionTitleComponent {}
