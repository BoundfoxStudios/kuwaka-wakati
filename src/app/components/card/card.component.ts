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
    @Input() contentType: 'default' | 'chart' = 'default';
    get contentTypeClasses(): string {
        switch (this.contentType) {
            case 'chart':
                return 'p-4 grid grid-cols-1';

            default:
                return 'p-4 flex flex-col';
        }
    }
}
