import { inject, Injectable } from '@angular/core';
import { TimeTable } from './time.table';
import { SettingsTable } from '../settings/settings.table';
import { combineLatest, map, Observable } from 'rxjs';
import { Today } from './time.models';
import { Duration } from 'luxon';
import { todayDateMilliseconds } from '../time.utils';

@Injectable({ providedIn: 'root' })
export class TimeService {
    private readonly timeTable = inject(TimeTable);
    private readonly settingsTable = inject(SettingsTable);

    today$(): Observable<Today> {
        return combineLatest([this.timeTable.today$(), this.settingsTable.current$()]).pipe(
            map(([today, settings]) => {
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

                return {
                    ...today,
                    remainingTime,
                    overtime,
                };
            }),
        );
    }
}
