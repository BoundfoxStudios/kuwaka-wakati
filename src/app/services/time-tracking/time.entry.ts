import { Duration } from 'date-fns';

export interface TimeEntry {
    id?: number;

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

export interface TimeEntryWithDuration extends TimeEntry {
    duration: Duration;
}
