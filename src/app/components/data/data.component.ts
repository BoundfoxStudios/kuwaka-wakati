import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'kw-data',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DataComponent {}
