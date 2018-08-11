import { Component, OnInit } from '@angular/core';
import { TournamentStatusService } from '../../services/tournament-status.service';
import { forkJoin } from '../../../../node_modules/rxjs';

@Component({
  selector: 'tournament-status',
  templateUrl: './tournament-status.component.html',
  styleUrls: ['./tournament-status.component.css']
})
export class TournamentStatusComponent implements OnInit {
  private _matchChangeTime
  private _secondsUntilMatchOnChange
  private _matchHasChanged = false
  private _stringTimeUntilMatch = 'Waiting for data'

  constructor(private tournamentStatusService: TournamentStatusService) {
   }

  ngOnInit() {
    let currentMatchNumber = this.tournamentStatusService.getMatch()

    this.tournamentStatusService.secondsUntilNextMatch().then(data =>{
      this._secondsUntilMatchOnChange = data
    })
    this._matchChangeTime = Date.now()
    
    setInterval(() => {
      this.matchChanged(currentMatchNumber)
      if(this._matchHasChanged){
        currentMatchNumber = this.tournamentStatusService.getMatch()

        
        this.tournamentStatusService.secondsUntilNextMatch().then(data =>{
          this._secondsUntilMatchOnChange = data
        })
        this._matchChangeTime = Date.now()
      }
      this._matchHasChanged = false
    }, 5000)
  }

  private matchChanged(match){
    forkJoin(match, this.tournamentStatusService.getMatch()).subscribe(data =>{
      this._matchHasChanged = data[0] !== data[1]
    })
  }

  timeUntilMatch(){
    if(typeof this._secondsUntilMatchOnChange === 'number'){
      this._stringTimeUntilMatch = ''
      console.log(this._secondsUntilMatchOnChange)
      let secondsUntilMatch = this._secondsUntilMatchOnChange + Math.floor((this._matchChangeTime-Date.now())/1000)
      if(secondsUntilMatch<0){
        this._stringTimeUntilMatch = '-'
        secondsUntilMatch *=-1
      }
      this._stringTimeUntilMatch += `${Math.floor(secondsUntilMatch/3600)}:${Math.floor(secondsUntilMatch/60) % 60}:${secondsUntilMatch % 60}`
    }
    return this._stringTimeUntilMatch
  }
}
