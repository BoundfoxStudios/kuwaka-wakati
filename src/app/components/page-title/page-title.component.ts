import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'kw-page-title',
    standalone: true,
    imports: [],
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {}
