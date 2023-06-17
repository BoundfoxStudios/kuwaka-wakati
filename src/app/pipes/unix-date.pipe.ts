import { Pipe, PipeTransform } from '@angular/core';
import { unixTimeToLocaleDate } from '../services/time.utils';

@Pipe({
    name: 'unixDate',
    standalone: true,
})
export class UnixDatePipe implements PipeTransform {
    transform(value: number | string): string {
        return unixTimeToLocaleDate(+value);
    }
}
