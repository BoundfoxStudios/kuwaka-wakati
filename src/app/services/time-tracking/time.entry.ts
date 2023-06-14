import { Duration } from 'luxon';

export interface TimeEntry {
    id: number;

    /**
     * Milliseconds
     */
    utcDate: number;

    /**
     * Milliseconds start time
     */
    start: number;

    /**
     * Milliseconds end time
     */
    end: number;
}

export type TimeEntryCreate = Omit<TimeEntry, 'id'>;

export interface TimeEntryWithDuration extends TimeEntry {
    duration: Duration;
}

export interface TimeEntryGroup {
    ids: number[];
    starts: number[];
    ends: number[];
    utcDate: number;
    duration: Duration;
}
