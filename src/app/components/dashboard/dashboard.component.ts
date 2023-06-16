import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TimeTable } from '../../services/time-tracking/time.table';
import { DateTime } from 'luxon';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
    selector: 'kw-dashboard',
    standalone: true,
    imports: [CommonModule, CardComponent, NgxChartsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
    private readonly timeTable = inject(TimeTable);
    protected chartData = toObservable(this.timeTable.groupByDay(0, DateTime.now().toMillis())).pipe(
        map(data => {
            return [
                {
                    name: 'Time',
                    series: data.map(d => ({
                        name: `${d.utcDate}`,
                        value: d.duration.toMillis(),
                    })),
                },
            ];
        }),
    );
}
