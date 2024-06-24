import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'kw-loading-spinner',
    standalone: true,
    imports: [],
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
