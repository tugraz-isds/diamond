import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datePipe',
    pure: false
})

export class datePipe implements PipeTransform {
    transform(date: string): any {
        if (!date) {
            return 0;
        }

        const date_ = date.slice(0, 10);
        const time_ = date.slice(11, 19);
        return `${date_} ${time_}`;
    }
}
