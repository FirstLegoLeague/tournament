import { Component, OnInit } from '@angular/core';
import { TournamentStatusService } from '../../services/tournament-status.service';

@Component({
  selector: 'tournament-status',
  templateUrl: './tournament-status.component.html',
  styleUrls: ['./tournament-status.component.css']
})
export class TournamentStatusComponent implements OnInit {

  constructor(private tournamentStatusService: TournamentStatusService) {
   }

  ngOnInit() {
  }

  timeUntilMatch(){
    return 'Test'
  }

}
