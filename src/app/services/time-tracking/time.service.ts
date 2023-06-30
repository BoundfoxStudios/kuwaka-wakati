import { inject, Injectable } from '@angular/core';
import { TimeTable } from './time.table';
import { SettingsTable } from '../settings/settings.table';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { DateTime, Duration } from 'luxon';
import { calculateRemainingAndOvertime, calculateTimeEntryGroupDuration, multiplyDuration } from '../time.utils';
import { Today, Week } from './time.models';

@Injectable({ providedIn: 'root' })
export class TimeService {
    private readonly timeTable = inject(TimeTable);
    private readonly settingsTable = inject(SettingsTable);
    readonly today$ = combineLatest([this.timeTable.todayGroup$(), this.settingsTable.current$]).pipe(
        map(([today, settings]): Today => {
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
    readonly overall$ = combineLatest([this.timeTable.groupByDay$(0, Number.MAX_SAFE_INTEGER), this.settingsTable.current$]).pipe(
        map(([groups, settings]) => {
            const workPerDay = Duration.fromMillis(settings.workPerDay);
            const amountOfDaysWorked = groups.filter(group => !group.isNonWorkday && !group.isADayOff).length;

            const nominalTime = multiplyDuration(workPerDay, amountOfDaysWorked);
            const actualTime = calculateTimeEntryGroupDuration(groups, workPerDay);

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

    week$(weekNumber: number): Observable<Week> {
        const week = DateTime.fromObject({ weekNumber });
        const weekStart = week.startOf('week').toMillis();
        const weekEnd = week.endOf('week').toMillis();

        return combineLatest([this.timeTable.groupByDay$(weekStart, weekEnd), this.settingsTable.current$]).pipe(
            map(([groups, settings]): Week => {
                const workPerDay = Duration.fromMillis(settings.workPerDay);
                const amountOfDaysOff = groups.filter(group => group.isADayOff).length;

                const nominalTime = multiplyDuration(workPerDay, 5 - amountOfDaysOff);
                const actualTime = calculateTimeEntryGroupDuration(groups, workPerDay);

                const { remainingTime, overtime } = calculateRemainingAndOvertime(nominalTime, actualTime);

                return {
                    items: groups.flatMap(group => group.items),
                    duration: actualTime,
                    remainingTime,
                    overtime,
                    weekNumber,
                    isNonWorkday: groups.every(group => group.isNonWorkday),
                    isADayOff: groups.every(group => group.isADayOff),
                };
            }),
            shareReplay({ refCount: true }),
        );
    }
}
