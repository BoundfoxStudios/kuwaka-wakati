import { inject, Injectable } from '@angular/core';
import { TimeTable } from './time.table';
import { SettingsTable } from '../settings/settings.table';
import { combineLatest, map, shareReplay } from 'rxjs';
import { Duration } from 'luxon';
import { multiplyDuration } from '../time.utils';

@Injectable({ providedIn: 'root' })
export class TimeService {
    private readonly timeTable = inject(TimeTable);
    private readonly settingsTable = inject(SettingsTable);
    readonly today$ = combineLatest([this.timeTable.todayGroup$(), this.settingsTable.current$()]).pipe(
        map(([today, settings]) => {
            console.time('calculation');
            const workPerDay = Duration.fromMillis(settings.workPerDay);

            const { duration } = today;
            const durationMilliseconds = duration.toMillis();

            let remainingTime: Duration | undefined;
            let overtime: Duration | undefined;

            if (durationMilliseconds > settings.workPerDay) {
                overtime = duration.minus(workPerDay);
            }

            if (durationMilliseconds < settings.workPerDay) {
                remainingTime = workPerDay.minus(duration);
            }
            console.timeEnd('calculation');

            return {
                ...today,
                remainingTime,
                overtime,
            };
        }),
        shareReplay(),
    );
    readonly overall$ = combineLatest([this.timeTable.groupByDay$(0, Number.MAX_SAFE_INTEGER), this.settingsTable.current$()]).pipe(
        map(([groups, settings]) => {
            const workPerDay = Duration.fromMillis(settings.workPerDay);
            const amountOfDaysWorked = groups.length;

            const nominalTime = multiplyDuration(workPerDay, amountOfDaysWorked);
            const actualTime = groups.reduce((sum, current) => sum.plus(current.duration), Duration.fromMillis(0));

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

            return {
                nominalTime,
                actualTime,
                remainingTime,
                overtime,
            };
        }),
        shareReplay(),
    );
}
