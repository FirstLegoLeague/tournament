import { Component, OnInit } from '@angular/core';
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

  constructor(private teamsService: TeamsService) { }

  ngOnInit() {

    this.teamsService.getAllTeams().subscribe((data: Array<Team>) =>{
      this.teams = data;
      this.showAffiliation = this.teams.some(team => team.affiliation !== null)
    });


  }

}
