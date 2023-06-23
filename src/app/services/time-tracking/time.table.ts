import { Injectable } from '@angular/core';
import { DatabaseTable } from '../database/database.service';
import { TimeEntry, TimeEntryCreate, TimeEntryGroup, TimeEntryWithDuration } from './time.models';
import { liveQuery, Table } from 'dexie';
import { Duration } from 'luxon';
import { Milliseconds, todayDateMilliseconds } from '../time.utils';
import { map, Observable } from 'rxjs';
import { dexieToRxObservable } from '../dexie-to-rxjs';

export const calculateDuration = ({ start, end }: TimeEntry): Duration => Duration.fromMillis(end - start);

@Injectable()
export class TimeTable implements DatabaseTable<TimeEntry> {
    readonly definition = '++id, utcDate';
    readonly name = 'times';
    readonly version = 2;
    private times!: Table<TimeEntry, number>;

    items$(fromTimestamp: Milliseconds = 0, toTimestamp: Milliseconds = Number.MAX_SAFE_INTEGER): Observable<TimeEntryWithDuration[]> {
        return dexieToRxObservable(liveQuery(async () => this.items(fromTimestamp, toTimestamp)));
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

    groupByDay$(fromTimestamp: Milliseconds, toTimestamp: Milliseconds): Observable<TimeEntryGroup[]> {
        return dexieToRxObservable(
            liveQuery(async () => {
                const items = await this.items(fromTimestamp, toTimestamp);
                const bucket = items.reduce((bucket, item) => {
                    const list = (bucket[item.utcDate] = bucket[item.utcDate] ?? []);
                    list.push(item);
                    return bucket;
                }, {} as { [key: number]: TimeEntryWithDuration[] });

                return Object.values(bucket).map<TimeEntryGroup>(timeEntries => ({
                    ids: timeEntries.map(entry => entry.id),
                    starts: timeEntries.map(entry => entry.start),
                    ends: timeEntries.map(entry => entry.end),
                    utcDate: timeEntries[0].utcDate,
                    duration: timeEntries.reduce((duration, current) => duration.plus(current.duration), Duration.fromMillis(0)),
                }));
            }),
        );
    }

    todayGroup$(): Observable<TimeEntryGroup> {
        const todayDate = todayDateMilliseconds;
        return this.groupByDay$(todayDate, todayDate + 1).pipe(
            map(([today]) => {
                if (!today) {
                    return {
                        ids: [],
                        ends: [],
                        starts: [],
                        duration: Duration.fromMillis(0),
                        utcDate: todayDateMilliseconds,
                    };
                }

                return today;
            }),
        );
    }

    todayItems$(): Observable<TimeEntryWithDuration[]> {
        const todayDate = todayDateMilliseconds;
        return this.items$(todayDate, todayDate + 1);
    }

    private async items(fromTimestamp: Milliseconds = 0, toTimestamp: Milliseconds = Number.MAX_SAFE_INTEGER): Promise<TimeEntryWithDuration[]> {
        const items = await this.times.where('utcDate').between(fromTimestamp, toTimestamp, true).toArray();
        items.sort((a, b) => (a.utcDate < b.utcDate ? 1 : 0));
        return items.map(item => ({ ...item, duration: calculateDuration(item) }));
    }
}
