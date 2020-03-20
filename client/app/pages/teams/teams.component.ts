import { Component, OnInit } from '@angular/core'
import { TeamsService } from '../../shared/services/resource_clients/teams.service'
import { Team } from '../../../../resources/team'
import { DeleteService } from '../../shared/services/delete.service'
import { EditService } from '../../shared/services/edit.service'

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  public loading: boolean = true
  public filter: string = ''

  constructor (private teamsService: TeamsService, private deleteModalsService: DeleteService, private editModalsService: EditService) {
  }

  ngOnInit () {
    this.teamsService.init().subscribe(() => {
      this.loading = false
    })
  }

  showAffiliation () {
    return this.teams().some(team => team.affiliation !== null)
  }

  teams () {
    return this.teamsService.data()
  }

  setEditModel (team) {
    this.editModalsService.openModalFor(team, this.teamsService)
  }

  setDeleteModel (team) {
    this.deleteModalsService.openModalFor(team, this.teamsService)
  }

  newTeam () {
    return new Team()
  }
}
