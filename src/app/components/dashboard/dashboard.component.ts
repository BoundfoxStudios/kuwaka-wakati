import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { TimeTable } from '../../services/time-tracking/time.table';
import { DateTime } from 'luxon';
import { HistoryChartComponent } from '../history-chart/history-chart.component';
import { SettingsTable } from '../../services/settings/settings.table';
import { TodayComponent } from '../today/today.component';
import { RouterLink } from '@angular/router';
import { TimeService } from '../../services/time-tracking/time.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TimeEntryComponent } from '../times/time-entry/time-entry.component';
import { TimeEntry, TimeEntryCreate } from '../../services/time-tracking/time.models';
import { TimeTableComponent } from '../times/time-table/time-table.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { OverallComponent } from '../overall/overall.component';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { dateTimeToDate, Milliseconds } from '../../services/time.utils';
import { WeekComponent } from '../week/week.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

type Resolution = 'all' | '1 m' | '6 m' | '12 m';

@Component({
    selector: 'kw-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        HistoryChartComponent,
        TodayComponent,
        RouterLink,
        FontAwesomeModule,
        TimeEntryComponent,
        TimeTableComponent,
        PageTitleComponent,
        OverallComponent,
        WeekComponent,
        LoadingSpinnerComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
    protected isTimeEntryVisible = false;
    protected readonly faCheckCircle = faCheckCircle;
    protected readonly faPlus = faPlus;
    protected readonly faClose = faClose;
    protected readonly faChevronLeft = faChevronLeft;
    protected readonly faChevronRight = faChevronRight;
    protected readonly faCalendar = faCalendar;
    protected readonly chartResolution$ = new BehaviorSubject<Resolution>('1 m');
    private readonly weekDate$ = new BehaviorSubject<DateTime>(DateTime.now());
    protected readonly weekNumber$ = this.weekDate$.pipe(map(weekDate => weekDate.get('weekNumber')));
    protected readonly weekFromTo$ = this.weekNumber$.pipe(
        map(weekNumber => {
            const week = DateTime.fromObject({ weekNumber });
            const start = week.startOf('week');
            const end = week.endOf('week');
            return `${dateTimeToDate(start)} - ${dateTimeToDate(end)}`;
        }),
    );
    private readonly timeTable = inject(TimeTable);
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings$ = this.settingsTable.current$;
    protected readonly chartData$ = this.chartResolution$.pipe(
        switchMap(resolution =>
            combineLatest({
                settings: this.settings$,
                data: this.timeTable
                    .groupByDay$(this.resolutionMillisecondsAgo(resolution), DateTime.now().toMillis())
                    .pipe(map(data => data.filter(item => !item.isADayOff && !item.isNonWorkday).reverse())),
            }),
        ),
    );
    private readonly timeService = inject(TimeService);
    protected readonly today$ = this.timeService.today$;
    protected readonly isWorkDayDone$ = this.today$.pipe(map(today => (today ? !today.remainingTime : undefined)));
    protected readonly overall$ = this.timeService.overall$;
    protected readonly week$ = this.weekNumber$.pipe(switchMap(weekNumber => this.timeService.week$(weekNumber)));

    protected async addTimeEntry(timeEntry: TimeEntryCreate): Promise<void> {
        await this.timeTable.add(timeEntry);
        this.isTimeEntryVisible = false;
    }

    protected async deleteTimeEntry(timeEntry: TimeEntry): Promise<void> {
        return this.timeTable.delete(timeEntry.id);
    }

    protected updateWeek(delta: number): void {
        this.weekDate$.next(this.weekDate$.value.plus({ week: delta }));
    }

    protected showThisWeek(): void {
        this.weekDate$.next(DateTime.now());
    }

    private resolutionMillisecondsAgo(resolution: Resolution): Milliseconds {
        if (resolution === 'all') {
            return 0;
        }

        return DateTime.now()
            .minus({
                month: parseInt(resolution.split(' ')[0], 10),
            })
            .toMillis();
    }
}
