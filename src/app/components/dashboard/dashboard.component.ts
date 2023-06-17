import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TimeTable } from '../../services/time-tracking/time.table';
import { DateTime } from 'luxon';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HistoryChartComponent } from '../history-chart/history-chart.component';
import { unixTimeToLocaleDate } from '../../services/time.utils';
import { SettingsTable } from '../../services/settings/settings.table';

@Component({
    selector: 'kw-dashboard',
    standalone: true,
    imports: [CommonModule, CardComponent, NgxChartsModule, HistoryChartComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
    private readonly timeTable = inject(TimeTable);
    private readonly settingsTable = inject(SettingsTable);

    protected readonly chartData = this.timeTable.groupByDay(0, DateTime.now().toMillis());
    protected readonly settings = this.settingsTable.current();
}
