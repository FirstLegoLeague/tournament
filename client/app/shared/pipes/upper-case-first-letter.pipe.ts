import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'upperCaseFirstLetter'
})
export class UpperCaseFirstLetterPipe implements PipeTransform {

  transform (value: any, args?: any): any {
    if (value) {
      let stringRegex = /^\D/
      let regex = new RegExp(stringRegex)

      if (regex.test(value)) {
        let first = value.slice(0, 1)
        let stelse = value.slice(1, value.length)
        return first.toUpperCase() + stelse
      }
      return value
    }
    return ''
  }
}
