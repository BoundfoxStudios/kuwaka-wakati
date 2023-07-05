import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntryComponent } from './time-entry/time-entry.component';
import { TimeTable } from '../../services/time-tracking/time.table';
import { TimeEntry, TimeEntryCreate } from '../../services/time-tracking/time.models';
import { TimeTableComponent } from './time-table/time-table.component';
import { CardComponent } from '../card/card.component';
import ImporterComponent from '../importer/importer.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
    selector: 'kw-times',
    standalone: true,
    imports: [CommonModule, TimeEntryComponent, TimeTableComponent, CardComponent, ImporterComponent, PageTitleComponent],
    templateUrl: './times.component.html',
    styleUrls: ['./times.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TimesComponent {
    private readonly timeTable = inject(TimeTable);
    times$ = this.timeTable.items$();

    add(timeEntry: TimeEntryCreate): void {
        void this.timeTable.add(timeEntry);
    }

    delete(timeEntry: TimeEntry): void {
        void this.timeTable.delete(timeEntry.id);
    }
}
