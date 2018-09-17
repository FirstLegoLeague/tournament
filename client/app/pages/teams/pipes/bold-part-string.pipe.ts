import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'boldPartString'
})
export class BoldPartStringPipe implements PipeTransform {

    transform(value: any, part: any): any {
        if (part != '' && value.toLowerCase().indexOf(part.toLowerCase()) != -1) {
            let re = value.toLowerCase().indexOf(part.toLowerCase())
            return `${value.substring(0, re)}<strong>${value.substring(re, re + part.length)}</strong>${value.substring(re + part.length, value.length)}`
        }

        return value;
    }

}
