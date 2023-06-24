import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MillisecondsToTimePipe } from '../../../pipes/milliseconds-to-time.pipe';
import { DurationPipe } from '../../../pipes/duration.pipe';
import { TimeEntryWithDuration } from '../../../services/time-tracking/time.models';
import { UnixDatePipe } from '../../../pipes/unix-date.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ScrollViewportProviderDirective } from './scroll-viewport-provider.directive';

@Component({
    selector: 'kw-time-table',
    standalone: true,
    imports: [
        CommonModule,
        MillisecondsToTimePipe,
        DurationPipe,
        UnixDatePipe,
        FontAwesomeModule,
        CdkVirtualScrollViewport,
        CdkVirtualForOf,
        CdkFixedSizeVirtualScroll,
        ScrollViewportProviderDirective,
    ],
    templateUrl: './time-table.component.html',
    styleUrls: ['./time-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTableComponent {
    @Input() useVirtualScroll = false;
    @Input({ required: true }) times: TimeEntryWithDuration[] = [];
    @Output() delete = new EventEmitter<TimeEntryWithDuration>();
    protected readonly faTrashAlt = faTrashAlt;
}
