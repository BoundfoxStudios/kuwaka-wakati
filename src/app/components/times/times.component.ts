import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { TimeTable } from '../../services/time-tracking/time.table';
import { TimeEntry } from '../../services/time-tracking/time.entry';
import { TimeTableComponent } from './time-table/time-table.component';
import { CardComponent } from '../presentation/card/card.component';

@Component({
    selector: 'kw-times',
    standalone: true,
    imports: [CommonModule, TimeEntryComponent, TimeTableComponent, CardComponent],
    templateUrl: './times.component.html',
    styleUrls: ['./times.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TimesComponent {
    private readonly timeTable = inject(TimeTable);
    times$ = this.timeTable.items$;

    add(timeEntry: TimeEntry): void {
        void this.timeTable.add(timeEntry);
    }
}
