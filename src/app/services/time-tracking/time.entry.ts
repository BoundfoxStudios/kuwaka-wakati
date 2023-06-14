import { Duration } from 'date-fns';

export interface TimeEntry {
    id: number;

    /**
     * Seconds
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
