import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TimeTable } from '../../services/time-tracking/time.table';
import { DateTime } from 'luxon';
import { toSignal } from '@angular/core/rxjs-interop';
import { HistoryChartComponent } from '../history-chart/history-chart.component';
import { SettingsTable } from '../../services/settings/settings.table';
import { TodayComponent } from '../today/today.component';
import { RouterLink } from '@angular/router';
import { TimeService } from '../../services/time-tracking/time.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faClose, faExclamationCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TimeEntryComponent } from '../times/time-entry/time-entry.component';
import { TimeEntry, TimeEntryCreate } from '../../services/time-tracking/time.models';
import { TimeTableComponent } from '../times/time-table/time-table.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
    selector: 'kw-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        NgxChartsModule,
        HistoryChartComponent,
        TodayComponent,
        RouterLink,
        FontAwesomeModule,
        TimeEntryComponent,
        TimeTableComponent,
        PageTitleComponent,
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
    private readonly timeTable = inject(TimeTable);
    protected readonly chartData = toSignal(this.timeTable.groupByDay$(0, DateTime.now().toMillis()), { initialValue: [] });
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings = toSignal(this.settingsTable.current$(), { requireSync: true });
    private readonly timeService = inject(TimeService);
    protected readonly today = toSignal(this.timeService.today$());
    protected readonly isWorkDayDone = computed(() => {
        const today = this.today();

        if (!today) {
            return;
        }

        return !today.remainingTime;
    });
    protected readonly todayItems = toSignal(this.timeTable.todayItems$(), { initialValue: [] });

    protected async addTimeEntry(timeEntry: TimeEntryCreate): Promise<void> {
        await this.timeTable.add(timeEntry);
        this.isTimeEntryVisible = false;
    }

    protected async deleteTimeEntry(timeEntry: TimeEntry): Promise<void> {
        return this.timeTable.delete(timeEntry.id);
    }

    protected readonly faExclamationCircle = faExclamationCircle;
}
