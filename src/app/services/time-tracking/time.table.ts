import { Injectable } from '@angular/core';
import { DatabaseTable } from '../database/database.service';
import { TimeEntry, TimeEntryCreate, TimeEntryWithDuration } from './time.entry';
import { liveQuery, Table } from 'dexie';
import { Observable } from 'rxjs';
import { dexieToRxObservable } from '../dexie-to-rxjs';
import { Duration, intervalToDuration, secondsToMilliseconds } from 'date-fns';

export const calculateDuration = ({ start, end }: TimeEntry): Duration =>
    intervalToDuration({ start: secondsToMilliseconds(start), end: secondsToMilliseconds(end) });

@Injectable()
export class TimeTable implements DatabaseTable<TimeEntry> {
    readonly definition = '++id,utcDate';
    readonly name = 'times';
    readonly version = 2;
    private times!: Table<TimeEntry, number>;

    get items$(): Observable<TimeEntryWithDuration[]> {
        return dexieToRxObservable(
            liveQuery(async () => {
                const items = await this.times.orderBy('utcDate').reverse().toArray();
                return items.map(item => ({ ...item, duration: calculateDuration(item) }));
            }),
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
