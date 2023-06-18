import { Injectable } from '@angular/core';
import { DatabaseTable } from '../database/database.service';
import { TimeEntry, TimeEntryCreate, TimeEntryGroup, TimeEntryWithDuration } from './time.models';
import { liveQuery, Table } from 'dexie';
import { DateTime, Duration } from 'luxon';
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

    items$(): Observable<TimeEntryWithDuration[]> {
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

    groupByDay$(fromTimestamp: Milliseconds, toTimestamp: Milliseconds): Observable<TimeEntryGroup[]> {
        return dexieToRxObservable(
            liveQuery(async () => {
                const items = await this.times.where('utcDate').between(fromTimestamp, toTimestamp, true).toArray();
                const bucket = items.reduce((bucket, item) => {
                    const list = (bucket[item.utcDate] = bucket[item.utcDate] ?? []);
                    list.push(item);
                    return bucket;
                }, {} as { [key: number]: TimeEntry[] });

                return Object.values(bucket).map<TimeEntryGroup>(timeEntries => ({
                    ids: timeEntries.map(entry => entry.id),
                    starts: timeEntries.map(entry => entry.start),
                    ends: timeEntries.map(entry => entry.end),
                    utcDate: timeEntries[0].utcDate,
                    duration: timeEntries
                        .map(entry => calculateDuration(entry))
                        .reduce((duration, current) => duration.plus(current), Duration.fromMillis(0)),
                }));
            }),
        );
    }

    today$(): Observable<TimeEntryGroup> {
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
}
