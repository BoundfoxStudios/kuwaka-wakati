import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'luxon';

@Pipe({
    name: 'duration',
    standalone: true,
})
export class DurationPipe implements PipeTransform {
    transform(duration: Duration | number): string {
        if (typeof duration === 'number') {
            duration = Duration.fromMillis(duration);
        }

        const milliseconds = duration.toMillis();

        return milliseconds < 0 ? duration.negate().toFormat('-hh:mm') : duration.toFormat('hh:mm');
    }
}
