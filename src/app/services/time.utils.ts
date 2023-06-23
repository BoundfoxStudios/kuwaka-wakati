import { DateTime, Duration } from 'luxon';

export type Milliseconds = number;

/**
 * Parses a time string in the format HH:mm.
 */
export const parseTimeToDuration = (time: string): Duration => {
    const [hours, minutes] = time.split(':');
    return Duration.fromObject({ hour: +hours, minute: +minutes });
};

/**
 * Parses a tiem string in the format HH:mm.
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

export const unixTimeToLocaleDate = (milliseconds: Milliseconds): string => DateTime.fromMillis(milliseconds).toLocaleString({ dateStyle: 'medium' });
export const unixTimeToDate = (milliseconds: Milliseconds): string => DateTime.fromMillis(milliseconds).toFormat('dd.MM');

export const todayDateMilliseconds = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toMillis();
