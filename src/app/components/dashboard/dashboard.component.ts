import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { TimeTable } from '../../services/time-tracking/time.table';
import { DateTime } from 'luxon';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
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
import { map, switchMap } from 'rxjs';
import { dateTimeToDate } from '../../services/time.utils';
import { WeekComponent } from '../week/week.component';

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
    protected readonly weekFromTo = computed(() => {
        const weekNumber = this.weekNumber();
        const week = DateTime.fromObject({ weekNumber });
        const start = week.startOf('week');
        const end = week.endOf('week');
        return `${dateTimeToDate(start)} - ${dateTimeToDate(end)}`;
    });
    protected readonly isWorkDayDone = computed(() => {
        const today = this.today();

        if (!today) {
            return;
        }

        return !today.remainingTime;
    });
    private readonly weekDate = signal(DateTime.now());
    protected readonly weekNumber = computed(() => this.weekDate().get('weekNumber'));
    private readonly timeTable = inject(TimeTable);
    protected readonly chartData = toSignal(this.timeTable.groupByDay$(0, DateTime.now().toMillis()).pipe(map(data => data.reverse())), {
        initialValue: [],
    });
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings = toSignal(this.settingsTable.current$);
    private readonly timeService = inject(TimeService);
    protected readonly today = toSignal(this.timeService.today$);
    protected readonly overall = toSignal(this.timeService.overall$);
    protected readonly week = toSignal(toObservable(this.weekNumber).pipe(switchMap(weekNumber => this.timeService.week$(weekNumber))));

    protected async addTimeEntry(timeEntry: TimeEntryCreate): Promise<void> {
        await this.timeTable.add(timeEntry);
        this.isTimeEntryVisible = false;
    }

    protected async deleteTimeEntry(timeEntry: TimeEntry): Promise<void> {
        return this.timeTable.delete(timeEntry.id);
    }

    protected updateWeek(delta: number): void {
        this.weekDate.update(current => current.plus({ week: delta }));
    }

    protected showThisWeek(): void {
        this.weekDate.set(DateTime.now());
    }
}
