import { Component, OnInit } from '@angular/core';
import { ModelModalsService } from '../../services/model-modals.service';
import {TeamsService} from '../../services/teams.service';
import {Team} from '../../models/team';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  public teams: Array<Team>;
  public showAffiliation: Boolean;

  constructor(private teamsService: TeamsService, private modelModalsService: ModelModalsService) { }

  ngOnInit() {
    this.teamsService.getAllTeams().subscribe((data: Array<Team>) =>{
      this.teams = data.map(team => new Team().deserialize(team));
      this.showAffiliation = this.teams.some(team => team.affiliation !== null)
    });
  }

  setEditModel(team) {
    this.modelModalsService.setEditModel(team);
  }

  setDeleteModel(team) {
    this.modelModalsService.setDeleteModel(team);
  }

}
