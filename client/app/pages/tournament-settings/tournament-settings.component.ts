import { Component, OnInit } from '@angular/core';
import {TournamentSettingsService} from "../../services/tournament-settings.service";

@Component({
  selector: 'app-tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.css']
})
export class TournamentSettingsComponent implements OnInit {

   public settings: object;
   public loading: boolean = true;

  constructor(private tournamentSettingsService: TournamentSettingsService) { }

  ngOnInit() {
      this.tournamentSettingsService.getAllSettings().subscribe((settings: object)=>{
          this.settings = settings;
          this.loading = false;
      });
  }

}
