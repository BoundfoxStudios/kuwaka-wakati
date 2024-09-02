import { Injectable } from '@angular/core';
import { DatabaseTable } from '../database/database.service';
import { TimeEntry, TimeEntryCreate, TimeEntryGroup, TimeEntryWithDuration } from './time.models';
import { liveQuery, Table } from 'dexie';
import { Duration } from 'luxon';
import { calculateGroup, Milliseconds, todayDateMilliseconds } from '../time.utils';
import { map, Observable } from 'rxjs';
import { dexieToRxObservable } from '../dexie-to-rxjs';

export const calculateDuration = ({ start, end }: TimeEntry): Duration => Duration.fromMillis(end - start);

@Injectable()
export class TimeTable implements DatabaseTable<TimeEntry> {
    readonly definition = '++id, utcDate';
    readonly name = 'times';
    readonly version = 4;
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
                return calculateGroup(items);
            }),
        );
    }

    todayGroup$(): Observable<TimeEntryGroup> {
        const todayDate = todayDateMilliseconds();
        return this.groupByDay$(todayDate, todayDate).pipe(
            map(([today]) => {
                if (!today) {
                    return {
                        items: [],
                        duration: Duration.fromMillis(0),
                        utcDate: todayDate,
                        isNonWorkday: false,
                        isADayOff: false,
                    };
                }

                return today;
            }),
        );
    }

    private async items(fromTimestamp: Milliseconds = 0, toTimestamp: Milliseconds = Number.MAX_SAFE_INTEGER): Promise<TimeEntryWithDuration[]> {
        const items = await this.times.where('utcDate').between(fromTimestamp, toTimestamp, true, true).toArray();
        items.sort((a, b) => {
            if (a.utcDate < b.utcDate) {
                return 1;
            } else if (a.utcDate > b.utcDate) {
                return -1;
            }

            return a.start < b.start ? 1 : a.start > b.start ? -1 : 0;
        });
        return items.map(item => ({ ...item, duration: calculateDuration(item) }));
    }
}
