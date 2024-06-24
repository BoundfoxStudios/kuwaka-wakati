import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Overall } from '../../services/time-tracking/time.models';
import { DurationPipe } from '../../pipes/duration.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MillisecondsToTimePipe } from '../../pipes/milliseconds-to-time.pipe';
import { UnixDatePipe } from '../../pipes/unix-date.pipe';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'kw-overall',
    standalone: true,
    imports: [DurationPipe, FontAwesomeModule, MillisecondsToTimePipe, UnixDatePipe],
    templateUrl: './overall.component.html',
    styleUrls: ['./overall.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallComponent {
    @Input({ required: true }) overall!: Overall;
    protected readonly faExclamationCircle = faExclamationCircle;
    protected readonly faCheckCircle = faCheckCircle;
}
