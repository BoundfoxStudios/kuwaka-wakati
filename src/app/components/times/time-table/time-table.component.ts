import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MillisecondsToTimePipe } from '../../../pipes/milliseconds-to-time.pipe';
import { DurationPipe } from '../../../pipes/duration.pipe';
import { TimeEntryWithDuration } from '../../../services/time-tracking/time.entry';
import { UnixDatePipe } from '../../../pipes/unix-date.pipe';

@Component({
    selector: 'kw-time-table',
    standalone: true,
    imports: [CommonModule, MillisecondsToTimePipe, DurationPipe, UnixDatePipe],
    templateUrl: './time-table.component.html',
    styleUrls: ['./time-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTableComponent {
    @Input({ required: true }) times: TimeEntryWithDuration[] = [];
}
