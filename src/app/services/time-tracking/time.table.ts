import { Injectable, Signal } from '@angular/core';
import { DatabaseTable } from '../database/database.service';
import { TimeEntry, TimeEntryCreate, TimeEntryGroup, TimeEntryWithDuration } from './time.entry';
import { liveQuery, Table } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';
import { Duration } from 'luxon';

export const calculateDuration = ({ start, end }: TimeEntry): Duration => Duration.fromMillis(end - start);

@Injectable()
export class TimeTable implements DatabaseTable<TimeEntry> {
    readonly definition = '++id, utcDate';
    readonly name = 'times';
    readonly version = 2;
    private times!: Table<TimeEntry, number>;

    items(): Signal<TimeEntryWithDuration[]> {
        return toSignal(
            liveQuery(async () => {
                const items = await this.times.orderBy('utcDate').reverse().toArray();
                return items.map(item => ({ ...item, duration: calculateDuration(item) }));
            }),
            { initialValue: [] },
        );
    }

    groupByDay(fromTimestamp: number, toTimestamp: number): Signal<TimeEntryGroup[]> {
        return toSignal(
            liveQuery(async () => {
                const items = await this.times.where('utcDate').between(fromTimestamp, toTimestamp, true).toArray();
                const b = items.reduce((bucket, item) => {
                    const list = (bucket[item.utcDate] = bucket[item.utcDate] ?? []);
                    list.push(item);
                    return bucket;
                }, {} as { [key: number]: TimeEntry[] });

                return Object.values(b).map<TimeEntryGroup>(timeEntries => ({
                    ids: timeEntries.map(entry => entry.id),
                    starts: timeEntries.map(entry => entry.start),
                    ends: timeEntries.map(entry => entry.end),
                    utcDate: timeEntries[0].utcDate,
                    duration: timeEntries
                        .map(entry => calculateDuration(entry))
                        .reduce((duration, current) => duration.plus(current), Duration.fromMillis(0)),
                }));
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
