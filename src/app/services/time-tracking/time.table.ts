import { Injectable, Signal } from '@angular/core';
import { DatabaseTable } from '../database/database.service';
import { TimeEntry, TimeEntryCreate, TimeEntryWithDuration } from './time.entry';
import { liveQuery, Table } from 'dexie';
import { Duration, intervalToDuration, secondsToMilliseconds } from 'date-fns';
import { toSignal } from '@angular/core/rxjs-interop';

export const calculateDuration = ({ start, end }: TimeEntry): Duration =>
    intervalToDuration({ start: secondsToMilliseconds(start), end: secondsToMilliseconds(end) });

@Injectable()
export class TimeTable implements DatabaseTable<TimeEntry> {
    readonly definition = '++id,utcDate';
    readonly name = 'times';
    readonly version = 2;
    private times!: Table<TimeEntry, number>;

    get items(): Signal<TimeEntryWithDuration[]> {
        return toSignal(
            liveQuery(async () => {
                const items = await this.times.orderBy('utcDate').reverse().toArray();
                return items.map(item => ({ ...item, duration: calculateDuration(item) }));
            }),
            { initialValue: [] },
        );
    }

    initialize(table: Table<TimeEntry, number>): void {
        this.times = table;
    }

    async add(entry: TimeEntryCreate): Promise<void> {
        await this.times.add({ ...entry } as TimeEntry);
    }

    delete(id: number): Promise<void> {
        return this.times.delete(id);
    }
}
