import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Today } from '../../services/time-tracking/time.models';
import { DurationPipe } from '../../pipes/duration.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MillisecondsToTimePipe } from '../../pipes/milliseconds-to-time.pipe';
import { UnixDatePipe } from '../../pipes/unix-date.pipe';
import { faCheck, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'kw-today',
    standalone: true,
    imports: [DurationPipe, FontAwesomeModule, MillisecondsToTimePipe, UnixDatePipe],
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodayComponent {
    @Input({ required: true }) today!: Today;
    protected readonly faCheck = faCheck;
    protected readonly faSun = faSun;
}
