import { DateTime, Duration } from 'luxon';
import { TimeEntryGroup, TimeEntryWithDuration } from './time-tracking/time.models';

export type Milliseconds = number;

/**
 * Parses a time string in the format HH:mm.
 */
export const parseTimeToDuration = (time: string): Duration => {
    const [hours, minutes] = time.split(':');
    return Duration.fromObject({ hour: +hours, minute: +minutes });
};

/**
 * Parses a time string in the format HH:mm.
 */
export const parseTimeToDateTime = (time: string): DateTime => {
    const [hours, minutes] = time.split(':');
    return DateTime.fromObject({ hour: +hours, minute: +minutes });
};

/**
 * Parses a time string in the format HH:mm.
 */
export const parseTime = (time: string): Milliseconds => parseTimeToDateTime(time).toMillis();

export const millisecondsToHumanReadable = (milliseconds: Milliseconds): string => durationToHumanReadable(Duration.fromMillis(milliseconds));
export const durationToHumanReadable = (duration: Duration): string => duration.toFormat('hh:mm');

export const multiplyDuration = (duration: Duration, times = 5): Duration => {
    let finalDuration = Duration.fromMillis(0);

    for (let i = 0; i < times; i++) {
        finalDuration = finalDuration.plus(duration);
    }

    return finalDuration;
};

export const dateTimeToLocaleData = (dateTime: DateTime): string => dateTime.toLocaleString({ dateStyle: 'medium' });
export const unixTimeToLocaleDate = (milliseconds: Milliseconds): string => dateTimeToLocaleData(DateTime.fromMillis(milliseconds));
export const dateTimeToDate = (dateTime: DateTime): string => dateTime.toFormat('dd.MM');
export const unixTimeToDate = (milliseconds: Milliseconds): string => dateTimeToDate(DateTime.fromMillis(milliseconds));

export const todayDateMilliseconds = (): number => DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toMillis();

export const calculateGroup = (items: TimeEntryWithDuration[]): TimeEntryGroup[] => {
    const bucket = items.reduce((bucket, item) => {
        const list = (bucket[item.utcDate] = bucket[item.utcDate] ?? []);
        list.push(item);
        return bucket;
    }, {} as { [key: number]: TimeEntryWithDuration[] });

    return Object.values(bucket).map<TimeEntryGroup>(timeEntries => ({
        items: timeEntries,
        utcDate: timeEntries[0].utcDate,
        duration: timeEntries.reduce(
            (duration, current) => (current.isADayOff ? duration.minus(current.duration) : duration.plus(current.duration)),
            Duration.fromMillis(0),
        ),
        isNonWorkday: timeEntries.every(entry => entry.isNonWorkday),
        isADayOff: timeEntries.every(entry => entry.isADayOff),
    }));
};

export const calculateRemainingAndOvertime = (
    nominalTime: Duration,
    actualTime: Duration,
): {
    remainingTime?: Duration;
    overtime?: Duration;
} => {
    const nominalTimeMilliseconds = nominalTime.toMillis();
    const actualTimeMilliseconds = actualTime.toMillis();

    let remainingTime: Duration | undefined;
    let overtime: Duration | undefined;

    if (nominalTimeMilliseconds > actualTimeMilliseconds) {
        remainingTime = nominalTime.minus(actualTime);
    }

    if (nominalTimeMilliseconds < actualTimeMilliseconds) {
        overtime = actualTime.minus(nominalTime);
    }

    return { remainingTime, overtime };
};
export const calculateTimeEntryGroupDuration = (groups: TimeEntryGroup[], workPerDay: Duration): Duration =>
    groups.reduce((sum, current) => (current.isADayOff ? sum.minus(workPerDay) : sum.plus(current.duration)), Duration.fromMillis(0));
