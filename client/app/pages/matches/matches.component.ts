import { Component, OnInit } from '@angular/core'
import { MatchesService } from '../../shared/services/matches.service'
import { TablesService } from '../../shared/services/tables.service'
import { Match } from '../../shared/models/match'
import { Table } from '../../shared/models/table'
import { DeleteService } from '../../shared/services/delete-service.service'
import { EditService } from '../../shared/services/edit-service.service'
import { forkJoin } from 'rxjs'

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  public loading: boolean = true
  public filter: string = ''

  constructor (private matchesService: MatchesService, private tablesService: TablesService, private deleteModalsService: DeleteService, private editModalsService: EditService) {
  }

  ngOnInit () {
    let matchesLoad = this.matchesService.init()
    let tablesLoad = this.tablesService.init()
    forkJoin([matchesLoad, tablesLoad]).subscribe(() => {
      this.loading = false
    })
  }

  tables () {
    return this.tablesService.tables
  }

  matches () {
    return this.matchesService.matches
  }

  setEditModel (match) {
    this.editModalsService.setEditModel(match)
  }

  setDeleteModel (match) {
    this.deleteModalsService.setDeleteModel(match)
  }

  newTable () {
    return new Table()
  }

  newMatch () {
    const match = new Match(this.tables())
    match.matchTeams = this.tables().map(table => ({ tableId: table.tableId, teamNumber: null }))
    return match
  }

  amountOfMissingFields () {
    let tablesAmount = this.tables().length
    let matchTableAmount = this.maxTeamsPerMatch()
    return tablesAmount - matchTableAmount
  }

  private maxTeamsPerMatch () {
    let matchTableAmount = 0
    for (let match of this.matches()) {
      if (match.matchTeams.length > matchTableAmount) {
        matchTableAmount = match.matchTeams.length
      }
    }
    return matchTableAmount
  }

  amountofMissingHeaderFields () {
    let tablesAmount = this.tables().length
    let matchTableAmount = this.maxTeamsPerMatch()
    return matchTableAmount - tablesAmount
  }

  missingFieldsArray (amount: number) {
    let arr = []
    for (let i = 0; i < amount; i++) {
      arr.push(i)
    }
    return arr
  }

}
