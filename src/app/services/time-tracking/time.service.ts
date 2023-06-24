import { inject, Injectable } from '@angular/core';
import { TimeTable } from './time.table';
import { SettingsTable } from '../settings/settings.table';
import { combineLatest, map, shareReplay } from 'rxjs';
import { Duration } from 'luxon';
import { calculateRemainingAndOvertime, multiplyDuration } from '../time.utils';

@Injectable({ providedIn: 'root' })
export class TimeService {
    private readonly timeTable = inject(TimeTable);
    private readonly settingsTable = inject(SettingsTable);
    readonly today$ = combineLatest([this.timeTable.todayGroup$(), this.settingsTable.current$()]).pipe(
        map(([today, settings]) => {
            const workPerDay = Duration.fromMillis(settings.workPerDay);

            const { remainingTime, overtime } = calculateRemainingAndOvertime(workPerDay, today.duration);

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

            const { remainingTime, overtime } = calculateRemainingAndOvertime(nominalTime, actualTime);

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
