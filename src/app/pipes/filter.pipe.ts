import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'participantsFilter',
    pure: false
})
export class participantsFilterPipe implements PipeTransform {
    transform(items: any[], id): any {
        if (!items || !id) {
            return 0;
        }
        
        const obj = items.filter(item => item["id"] == id);
        if(obj[0])
            return obj[0]["participants"];
    }
}