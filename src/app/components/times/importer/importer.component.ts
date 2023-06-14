import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TimeTable } from '../../../services/time-tracking/time.table';
import { DateTime, Duration } from 'luxon';

@Component({
    selector: 'kw-importer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './importer.component.html',
    styleUrls: ['./importer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImporterComponent {
    text = new FormControl<string>(``, { nonNullable: true });
    private readonly timeTable = inject(TimeTable);

    async import(): Promise<void> {
        const value = this.text.value;
        if (!value) {
            return;
        }

        const lines = value
            .split('\n')
            .map(line => line.trim())
            .filter(line => !!line);

        for (const line of lines) {
            const [date, start1, end1, start2, end2] = line.split('\t');
            console.log(date, start1, end1, start2, end2);

            const utcDate = DateTime.fromFormat(date, 'dd.MM.yy').toMillis();
            const start1Millis = DateTime.fromFormat(start1, 'HH:mm').toMillis();
            const end1Millis = DateTime.fromFormat(end1, 'HH:mm').toMillis();

            await this.timeTable.add({ utcDate, start: start1Millis, end: end1Millis });

            if (start2 !== end2) {
                const end2Millis = DateTime.fromFormat(end2, 'HH:mm').toMillis();
                const start2Millis = DateTime.fromFormat(start2, 'HH:mm').toMillis();
                await this.timeTable.add({ utcDate, start: start2Millis, end: end2Millis });
            }
        }
    }
}
