import { Component, OnInit } from '@angular/core';
import { TournamentStatusService } from '../../services/tournament-status.service';

@Component({
  selector: 'tournament-status',
  templateUrl: './tournament-status.component.html',
  styleUrls: ['./tournament-status.component.css']
})
export class TournamentStatusComponent implements OnInit {
  private stringTimeUntilMatch = 'Waiting for data'

  constructor(private tournamentStatusService: TournamentStatusService) {
   }

  ngOnInit() {
    setInterval(() => {
      let secondsUntilMatch = this.tournamentStatusService.secondsUntilNextMatch()
      this.stringTimeUntilMatch=''
      if(secondsUntilMatch<0){
        this.stringTimeUntilMatch = '-'
        secondsUntilMatch *=-1
      }
      this.stringTimeUntilMatch += `${Math.floor(secondsUntilMatch/3600)}:${Math.floor(secondsUntilMatch/60) % 60}:${secondsUntilMatch % 60}`  
    }, 800)
  }

  timeUntilMatch(){
    return this.stringTimeUntilMatch
  }

}
