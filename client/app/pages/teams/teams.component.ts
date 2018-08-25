import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { Team } from '../../models/team';
import { TablesService } from '../../services/tables.service'
import { DeleteService } from '../../services/delete-service.service'
import { EditService } from '../../services/edit-service.service'

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

    public loading: boolean = true;
  constructor(private teamsService: TeamsService, private deleteModalsService: DeleteService, private editModalsService: EditService) { }

  ngOnInit() {
    this.teamsService.init().subscribe(()=>{
        this.loading = false;
    });
  }

  showAffiliation() {
    return this.teams().some(team => team.affiliation !== null)
  }

  teams() {
    return this.teamsService.teams;
  }

  setEditModel(team) {
    this.editModalsService.setEditModel(team);
  }

  setDeleteModel(team) {
    this.deleteModalsService.setDeleteModel(team);
  }

  newTeam() {
    return new Team()
  }
}
