import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
    name: 'millisecondsToTime',
    standalone: true,
})
export class MillisecondsToTimePipe implements PipeTransform {
    transform(value: number): string {
        return DateTime.fromMillis(value).toFormat('HH:mm');
    }
}
