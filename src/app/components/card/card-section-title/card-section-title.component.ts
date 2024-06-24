import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'kw-card-section-title',
    standalone: true,
    imports: [],
    templateUrl: './card-section-title.component.html',
    styleUrls: ['./card-section-title.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSectionTitleComponent {}
