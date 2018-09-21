import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeLeftPipe'
})
export class TimeLeftPipe implements PipeTransform {

  transform(value: any): any {
      if(value) {
          let milliseconds = value
          let delta = Math.abs(milliseconds) / 1000;
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;
          let seconds = Math.floor(delta % 60);

          return `${milliseconds > 0 ? '-' : ''} ${this.pad(hours, 2)}:${this.pad(minutes, 2)}:${this.pad(seconds, 2)}`
      }

      return 'Unknown'
  }

    pad(number, size) {
        var s = String(number);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    }

}
