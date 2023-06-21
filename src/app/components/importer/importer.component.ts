import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TimeTable } from '../../services/time-tracking/time.table';
import { DateTime, Duration } from 'luxon';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
    selector: 'kw-importer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, PageTitleComponent],
    templateUrl: './importer.component.html',
    styleUrls: ['./importer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImporterComponent {
    text = new FormControl<string>(``, { nonNullable: true });
    private readonly timeTable = inject(TimeTable);
    protected importing = signal<boolean>(false);
    protected linesCount = signal<number>(0);
    protected currentLine = signal<number>(0);
    protected progressWidth = computed(() => (this.currentLine() * 100) / this.linesCount());

    async import(): Promise<void> {
        const value = this.text.value;
        if (!value) {
            return;
        }

        const lines = value
            .split('\n')
            .map(line => line.trim())
            .filter(line => !!line);

        this.linesCount.set(lines.length);
        this.currentLine.set(0);
        this.importing.set(true);

        for (const line of lines) {
            const [date, start1, end1, start2, end2] = line.split('\t');

            const utcDate = DateTime.fromFormat(date, 'dd.MM.yy').toMillis();
            const start1Millis = DateTime.fromFormat(start1, 'HH:mm').toMillis();
            const end1Millis = DateTime.fromFormat(end1, 'HH:mm').toMillis();

            await this.timeTable.add({ utcDate, start: start1Millis, end: end1Millis });

            if (start2 !== end2) {
                const end2Millis = DateTime.fromFormat(end2, 'HH:mm').toMillis();
                const start2Millis = DateTime.fromFormat(start2, 'HH:mm').toMillis();
                await this.timeTable.add({ utcDate, start: start2Millis, end: end2Millis });
            }
            this.currentLine.set(this.currentLine() + 1);
        }
    }
}
