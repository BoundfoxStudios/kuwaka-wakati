import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntryGroup } from '../../services/time-tracking/time.models';
import { Milliseconds, millisecondsToHumanReadable, unixTimeToDate } from '../../services/time.utils';
import { MillisecondsToTimePipe } from '../../pipes/milliseconds-to-time.pipe';
import { DurationPipe } from '../../pipes/duration.pipe';
import { UnixDatePipe } from '../../pipes/unix-date.pipe';
import { Chart } from 'chart.js';
import { StyleService } from '../../services/style.service';
import { Duration } from 'luxon';

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
    private chart?: Chart;

    @Input() set data(input: TimeEntryGroup[]) {
        this.setChartData(input);
    }

    ngAfterViewInit(): void {
        this.chart = new Chart(this.chartElement.nativeElement, {
            type: 'line',
            data: {
                datasets: [],
            },
            options: {
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
                        callbacks: {
                            label: (context): string => {
                                return millisecondsToHumanReadable(context.parsed.y);
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
        const data: number[] = [];

        for (const timeEntryGroup of timeEntryGroups) {
            labels.push(unixTimeToDate(timeEntryGroup.utcDate));
            data.push(timeEntryGroup.duration.toMillis());
        }

        this.chart.data = {
            labels,
            datasets: [{ data, borderColor: this.styleService.getCssVariable('--color-blue'), borderWidth: 1.5 }],
        };
        this.chart.update();
    }
}
