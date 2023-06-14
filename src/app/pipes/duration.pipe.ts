import { Pipe, PipeTransform } from '@angular/core';
import { Duration, formatDuration } from 'date-fns';

@Pipe({
    name: 'duration',
    standalone: true,
})
export class DurationPipe implements PipeTransform {
    transform(value: Duration): string {
        return formatDuration(value, { format: ['hours', 'minutes'] });
    }
}
