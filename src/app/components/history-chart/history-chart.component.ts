import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntryGroup } from '../../services/time-tracking/time.models';
import {
    calculateRemainingAndOvertime,
    durationToHumanReadable,
    Milliseconds,
    millisecondsToHumanReadable,
    unixTimeToDate,
} from '../../services/time.utils';
import { MillisecondsToTimePipe } from '../../pipes/milliseconds-to-time.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { UnixDatePipe } from '../../pipes/unix-date.pipe';
import { Chart } from 'chart.js';
import { StyleService } from '../../services/style.service';
import { Duration } from 'luxon';

interface ChartData {
    key: string;
    value: number;
    overtime?: Duration;
    remainingTime?: Duration;
}

@Component({
    selector: 'kw-history-chart',
    standalone: true,
    imports: [CommonModule, MillisecondsToTimePipe, DurationPipe, UnixDatePipe],
    templateUrl: './history-chart.component.html',
    styleUrls: ['./history-chart.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryChartComponent implements AfterViewInit, OnDestroy {
    @Input() height = 200;
    @Input() dailyWork: Milliseconds = 0;
    @ViewChild('chart', { static: true }) chartElement!: ElementRef<HTMLCanvasElement>;
    private readonly styleService = inject(StyleService);
    private chart?: Chart<'line', ChartData[]>;

    @Input() set data(input: TimeEntryGroup[]) {
        // Sorry :(
        // Easiest way to delay setting the data to let the component initialize first.
        void Promise.resolve().then(() => this.setChartData(input));
    }

    ngAfterViewInit(): void {
        this.chart = new Chart(this.chartElement.nativeElement, {
            type: 'line',
            data: {
                datasets: [],
            },
            options: {
                parsing: {
                    xAxisKey: 'key',
                    yAxisKey: 'value',
                },
                scales: {
                    x: {
                        type: 'category',
                    },
                    y: {
                        type: 'linear',
                        ticks: {
                            callback: tickValue => millisecondsToHumanReadable(+tickValue),
                            stepSize: Duration.fromObject({ hour: 1 }).toMillis(),
                        },
                        stacked: true,
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    point: {
                        radius: 2,
                        hitRadius: 6,
                        hoverRadius: 6,
                        backgroundColor: this.styleService.getCssVariable('--color-blue'),
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        displayColors: false,
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        callbacks: {
                            beforeBody: (context): string => {
                                return millisecondsToHumanReadable(context[0].parsed.y);
                            },
                            label: (context): string => {
                                const { overtime, remainingTime } = context.raw as ChartData;

                                if (overtime) {
                                    return `+${durationToHumanReadable(overtime)}`;
                                }

                                if (remainingTime) {
                                    return `-${durationToHumanReadable(remainingTime)}`;
                                }

                                return '';
                            },
                            labelTextColor: (context): string => {
                                const { overtime, remainingTime } = context.raw as ChartData;

                                if (overtime) {
                                    return this.styleService.getCssVariable('--color-green');
                                }

                                if (remainingTime) {
                                    return this.styleService.getCssVariable('--color-red');
                                }

                                return '';
                            },
                        },
                    },
                    annotation: {
                        annotations: {
                            dailyWork: {
                                type: 'line',
                                scaleID: 'y',
                                borderWidth: 1,
                                borderColor: this.styleService.getCssVariable('--color-gray-500'),
                                value: () => this.dailyWork,
                            },
                        },
                    },
                },
            },
        });
    }

    ngOnDestroy(): void {
        this.chart?.destroy();
    }

    private setChartData(timeEntryGroups: TimeEntryGroup[]): void {
        if (!this.chart) {
            return;
        }

        const labels: string[] = [];
        const data: ChartData[] = [];
        const dailyWorkDuration = Duration.fromMillis(this.dailyWork);

        for (const timeEntryGroup of timeEntryGroups) {
            const key = unixTimeToDate(timeEntryGroup.utcDate);
            const { remainingTime, overtime } = calculateRemainingAndOvertime(dailyWorkDuration, timeEntryGroup.duration);
            labels.push(key);
            data.push({ key, value: timeEntryGroup.duration.toMillis(), remainingTime, overtime });
        }

        this.chart.data = {
            labels,
            datasets: [
                {
                    data,
                    borderColor: this.styleService.getCssVariable('--color-blue'),
                    borderWidth: 1.5,
                },
            ],
        };
        this.chart.update();
    }
}
