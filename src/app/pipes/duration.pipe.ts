import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'date-fns';

@Pipe({
    name: 'duration',
    standalone: true,
})
export class DurationPipe implements PipeTransform {
    transform({ hours, minutes }: Duration): string {
        return `${`${hours ?? ''}`.padStart(2, '0')}:${`${minutes ?? ''}`.padStart(2, '0')}`;
    }
}
