import { Duration } from 'luxon';
import { Milliseconds } from '../time.utils';

export interface TimeEntry {
    id: number;
    utcDate: Milliseconds;
    start: Milliseconds;
    end: Milliseconds;
}

export type TimeEntryCreate = Omit<TimeEntry, 'id'>;

export interface TimeEntryWithDuration extends TimeEntry {
    duration: Duration;
}

export interface TimeEntryGroup {
    ids: number[];
    starts: Milliseconds[];
    ends: Milliseconds[];
    utcDate: Milliseconds;
    duration: Duration;
}

export interface Today extends TimeEntryGroup {
    remainingTime?: Duration;
    overtime?: Duration;
}
