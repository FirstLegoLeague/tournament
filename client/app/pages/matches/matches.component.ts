import { Component, OnInit } from '@angular/core'
import { MatchesService } from '../../shared/services/resource_clients/matches.service'
import { TablesService } from '../../shared/services/resource_clients/tables.service'
import { Match } from '../../../../resources/match'
import { Table } from '../../../../resources/table'
import { DeleteService } from '../../shared/services/delete.service'
import { EditService } from '../../shared/services/edit.service'
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
    forkJoin([this.matchesService.init(), this.tablesService.init()]).subscribe(() => {
      this.loading = false
    })
  }

  tables () {
    return this.tablesService.data()
  }

  matches () {
    return this.matchesService.data()
  }

  setEditModel (match) {
    this.editModalsService.openModalFor(match, this.matchesService)
  }

  setDeleteModel (match) {
    this.deleteModalsService.openModalFor(match, this.matchesService)
  }

  newTable () {
    return new Table()
  }

  newMatch () {
    const match = new Match(this.tables())
    match.teams = this.tables().map(table => ({ tableId: table.tableId, teamNumber: null }))
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
      if (match.teams.length > matchTableAmount) {
        matchTableAmount = match.teams.length
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
