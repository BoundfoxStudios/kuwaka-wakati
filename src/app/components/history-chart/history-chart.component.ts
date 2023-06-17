import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartModule } from '@swimlane/ngx-charts';
import { TimeEntryGroup } from '../../services/time-tracking/time.entry';
import { Milliseconds, millisecondsToHumanReadable, unixTimeToDate } from '../../services/time.utils';
import { MillisecondsToTimePipe } from '../../pipes/milliseconds-to-time.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { UnixDatePipe } from '../../pipes/unix-date.pipe';
import { Duration } from 'luxon';

interface SeriePoint {
    name: string;
    value: Milliseconds;
}

interface Serie {
    name: string;
    series: SeriePoint[];
}

function transformToSeries(input: TimeEntryGroup[]): Serie[] {
    return [
        {
            name: 'Time',
            series: input.map(data => ({
                name: unixTimeToDate(data.utcDate),
                value: data.duration.toMillis(),
            })),
        },
    ];
}

@Component({
    selector: 'kw-history-chart',
    standalone: true,
    imports: [CommonModule, LineChartModule, MillisecondsToTimePipe, DurationPipe, UnixDatePipe],
    templateUrl: './history-chart.component.html',
    styleUrls: ['./history-chart.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryChartComponent {
    @Input() @HostBinding('style.height.px') height = 200;
    protected series: Serie[] = [];
    protected yAxisTicks: number[] = [];
    protected referenceLines: SeriePoint[] = [];

    @Input() set data(input: TimeEntryGroup[]) {
        this.series = transformToSeries(input);
        const values = this.series[0].series.map(s => s.value);
        this.yAxisTicks = [Math.min(...values), Math.max(...values)];
    }

    @Input() set dailyWork(value: Milliseconds) {
        this.referenceLines = [
            {
                name: '',
                value,
            },
        ];
    }

    protected formatYAxisTicks(durationMilliseconds: Milliseconds): string {
        return millisecondsToHumanReadable(durationMilliseconds);
    }
}
