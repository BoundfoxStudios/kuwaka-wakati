import { Pipe, PipeTransform } from '@angular/core';
import { format, fromUnixTime } from 'date-fns';

@Pipe({
    name: 'unixDate',
    standalone: true,
})
export class UnixDatePipe implements PipeTransform {
    transform(value: number): string {
        return format(fromUnixTime(value), 'P');
    }
}
