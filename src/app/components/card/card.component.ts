import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
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
    @Input() fullSize = false;
    @Input() contentType: 'default' | 'chart' = 'default';

    get contentTypeClasses(): string {
        switch (this.contentType) {
            case 'chart':
                return 'p-4 grid grid-cols-1';

            default:
                return ['flex flex-col', this.fullSize ? 'h-full' : 'p-4'].join(' ');
        }
    }
}
