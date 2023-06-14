import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
    name: 'unixDate',
    standalone: true,
})
export class UnixDatePipe implements PipeTransform {
    transform(value: number): string {
        return DateTime.fromMillis(value).toLocaleString({ dateStyle: 'medium' });
    }
}
