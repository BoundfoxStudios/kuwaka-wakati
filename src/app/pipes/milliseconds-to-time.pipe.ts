import { Pipe, PipeTransform } from '@angular/core';
import { format, fromUnixTime } from 'date-fns';

@Pipe({
    name: 'millisecondsToTime',
    standalone: true,
})
export class MillisecondsToTimePipe implements PipeTransform {
    transform(value: number): string {
        const date = fromUnixTime(value);
        return format(date, 'HH:mm');
    }
}
