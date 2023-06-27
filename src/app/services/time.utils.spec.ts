import { DateTime, Duration } from 'luxon';
import {
    calculateRemainingAndOvertime,
    calculateTimeEntryGroupDuration,
    multiplyDuration,
    parseTimeToDateTime,
    parseTimeToDuration,
} from './time.utils';
import { TimeEntryGroup } from './time-tracking/time.models';

describe('Time Utils', () => {
    describe('multiplyDuration', () => {
        it('should output the same calculation when multiplied by 1', () => {
            const input = Duration.fromObject({ minutes: 5 });

            const result = multiplyDuration(input, 1);

            expect(result.minutes).toEqual(input.minutes);
        });

        it('should output 100 minutes when input is 50 multiplied by 2', () => {
            const input = Duration.fromObject({ minutes: 50 });

            const result = multiplyDuration(input, 2);

            expect(result.minutes).toEqual(100);
        });
    });

    describe('parseTimeToDuration', () => {
        it('parses 00:00 into a duration of 0 milliseconds', () => {
            const result = parseTimeToDuration('00:00');

            expect(result.toMillis()).toEqual(0);
        });

        it('parses 01:00 into a duration of 1 hour', () => {
            const result = parseTimeToDuration('01:00');

            expect(result.toMillis()).toEqual(1000 * 60 * 60);
        });

        it('parses 10:15 into a duration of 10 hours and 15 minutes', () => {
            const result = parseTimeToDuration('10:15');

            expect(result.hours).toEqual(10);
            expect(result.minutes).toEqual(15);
        });

        it('parses 48:59 into a duration of 48 hours and 59 minutes', () => {
            const result = parseTimeToDuration('48:59');

            expect(result.hours).toEqual(48);
            expect(result.minutes).toEqual(59);
        });
    });

    describe('parseTimeToDateTime', () => {
        it('parses 00:00 into today midnight', () => {
            const result = parseTimeToDateTime('00:00');

            expect(result.toMillis()).toEqual(DateTime.now().startOf('day').toMillis());
        });

        it('parses 01:00 into today 01:00', () => {
            const result = parseTimeToDateTime('01:00');

            expect(result.toMillis()).toEqual(DateTime.now().startOf('day').plus({ hour: 1 }).toMillis());
        });

        it('parses 10:15 into today 10:15', () => {
            const result = parseTimeToDateTime('10:15');

            expect(result.hour).toEqual(10);
            expect(result.minute).toEqual(15);
        });

        it('can not parse 48:59', () => {
            const result = parseTimeToDateTime('48:59');

            expect(result.hour).toBeNaN();
            expect(result.minute).toBeNaN();
            expect(result.isValid).toEqual(false);
        });
    });

    describe('calculateTimeEntryGroupDuration', () => {
        it('calculates correct duration with 1 item', () => {
            const result = calculateTimeEntryGroupDuration([
                {
                    duration: Duration.fromObject({ minutes: 40 }),
                } as TimeEntryGroup,
            ]);

            expect(result.minutes).toEqual(40);
        });

        it('calculates correct duration with 3 item', () => {
            const result = calculateTimeEntryGroupDuration([
                {
                    duration: Duration.fromObject({ hours: 1, minutes: 40 }),
                } as TimeEntryGroup,
                {
                    duration: Duration.fromObject({ hours: 3, minutes: 40 }),
                } as TimeEntryGroup,
                {
                    duration: Duration.fromObject({ minutes: 40 }),
                } as TimeEntryGroup,
            ]);

            expect(result.minutes).toEqual(40 * 3);
            expect(result.hours).toEqual(4);
        });
    });

    describe('calculateRemainingAndOvertime', () => {
        it('correctly calculates remaining time', () => {
            const result = calculateRemainingAndOvertime(Duration.fromObject({ hours: 8 }), Duration.fromObject({ hours: 4 }));

            expect(result.overtime).toBeUndefined();
            expect(result.remainingTime).toBeDefined();
            expect(result.remainingTime?.hours).toEqual(4);
        });

        it('correctly calculates overtime', () => {
            const result = calculateRemainingAndOvertime(Duration.fromObject({ hours: 4 }), Duration.fromObject({ hours: 8 }));

            expect(result.remainingTime).toBeUndefined();
            expect(result.overtime).toBeDefined();
            expect(result.overtime?.hours).toEqual(4);
        });
    });
});
