import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'teamMatchesPipe'
})
export class TeamMatchesPipe implements PipeTransform {

  transform (value: any, team: any): any {
    if (team !== '') {
      return value.filter(match => match.matchTeams.some(matchTeam => {
        if (matchTeam.teamNumber != null) {
          return matchTeam.teamNumber.toString().includes(team)
        }
        return false
      }))
    }

    return value
  }

}
