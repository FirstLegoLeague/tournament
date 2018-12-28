import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'upperCaseFirstLetter'
})
export class UpperCaseFirstLetterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      let string = value
      if (string) {
          let stringRegex = /^\D/
          let regex = new RegExp(stringRegex)

          if (regex.test(string)) {
              let first = string.slice(0, 1)
              let stelse = string.slice(1, string.length)
              return first.toUpperCase() + stelse
          }
          return string
      }
      return ''
  }

}
