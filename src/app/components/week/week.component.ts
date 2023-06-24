import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Week } from '../../services/time-tracking/time.models';
import { DurationPipe } from '../../pipes/duration.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MillisecondsToTimePipe } from '../../pipes/milliseconds-to-time.pipe';
import { UnixDatePipe } from '../../pipes/unix-date.pipe';

@Component({
    selector: 'kw-week',
    standalone: true,
    imports: [CommonModule, DurationPipe, FontAwesomeModule, MillisecondsToTimePipe, UnixDatePipe],
    templateUrl: './week.component.html',
    styleUrls: ['./week.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekComponent {
    @Input({ required: true }) week!: Week;
}
