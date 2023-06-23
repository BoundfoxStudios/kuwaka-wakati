import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Today } from '../../services/time-tracking/time.models';
import { DurationPipe } from '../../pipes/duration.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MillisecondsToTimePipe } from '../../pipes/milliseconds-to-time.pipe';
import { UnixDatePipe } from '../../pipes/unix-date.pipe';

@Component({
    selector: 'kw-today',
    standalone: true,
    imports: [CommonModule, DurationPipe, FontAwesomeModule, MillisecondsToTimePipe, UnixDatePipe],
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodayComponent {
    @Input({ required: true }) today!: Today;
}
