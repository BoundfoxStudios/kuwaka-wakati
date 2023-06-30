import { Duration } from 'luxon';
import { Milliseconds } from '../time.utils';

export interface TimeEntry {
    id: number;
    utcDate: Milliseconds;
    start: Milliseconds;
    end: Milliseconds;
    isNonWorkday: boolean;
    isADayOff: boolean;
}

export type TimeEntryCreate = Omit<TimeEntry, 'id'>;

export interface TimeEntryWithDuration extends TimeEntry {
    duration: Duration;
}

export interface TimeEntryGroup {
    items: TimeEntryWithDuration[];
    utcDate: Milliseconds;
    duration: Duration;
    isNonWorkday: boolean;
    isADayOff: boolean;
}

export interface RemainingTimeOvertime {
    remainingTime?: Duration;
    overtime?: Duration;
}

export type Today = TimeEntryGroup & RemainingTimeOvertime;

export interface Week extends Omit<TimeEntryGroup, 'utcDate'>, RemainingTimeOvertime {
    weekNumber: number;
}

export interface Overall extends RemainingTimeOvertime {
    nominalTime: Duration;
    actualTime: Duration;
}
