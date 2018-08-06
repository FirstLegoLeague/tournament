import { Component, OnInit } from '@angular/core';
import { ModelModalsService } from '../../services/model-modals.service';
import { TeamsService } from '../../services/teams.service';
import { Team } from '../../models/team';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  
  constructor(private teamsService: TeamsService, private modelModalsService: ModelModalsService) { }

  ngOnInit() {
    this.teamsService.reload();
  }

  showAffiliation() {
    return this.teams().some(team => team.affiliation !== null)
  }

  teams() {
     return this.teamsService.teams;
  }

  setEditModel(team) {
    this.modelModalsService.setEditModel(team);
  }

  setDeleteModel(team) {
    this.modelModalsService.setDeleteModel(team);
  }

}
