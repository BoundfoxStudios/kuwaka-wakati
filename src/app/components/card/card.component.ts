import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
    @Input() hasFlexBody = true;
}
