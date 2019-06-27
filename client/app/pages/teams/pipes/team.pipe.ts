import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'teamPipe'
})
export class TeamPipe implements PipeTransform {

  transform (value: any, text: any): any {
    let isTeamNumberPattern = /^#/

    if (isTeamNumberPattern.test(text)) {
      let teamNumberToFind = text.slice(1)
      if (teamNumberToFind !== '') {
        return value.filter(x => x.number.toString().includes(teamNumberToFind))
      }
    }

    if (text !== '') {
      return value.filter(x => {
        let match
        match = x.number.toString().includes(text)
        match = match || x.name.toLowerCase().includes(text.toLowerCase())
        return match
      })
    }

    return value
  }
}
