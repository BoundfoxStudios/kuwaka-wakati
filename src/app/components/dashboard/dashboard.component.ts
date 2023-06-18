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

@Component({
    selector: 'kw-dashboard',
    standalone: true,
    imports: [CommonModule, CardComponent, NgxChartsModule, HistoryChartComponent, TodayComponent, RouterLink, FontAwesomeModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
    private readonly timeTable = inject(TimeTable);
    protected readonly chartData = toSignal(this.timeTable.groupByDay$(0, DateTime.now().toMillis()), { initialValue: [] });
    private readonly settingsTable = inject(SettingsTable);
    protected readonly settings = toSignal(this.settingsTable.current$(), { requireSync: true });
    private readonly timeService = inject(TimeService);
    protected readonly today = toSignal(this.timeService.today$());
    protected readonly isWorkDayDone = computed(() => {
        const today = this.today();

        return !today?.remainingTime;
    });
    protected readonly faCheckCircle = faCheckCircle;
}
