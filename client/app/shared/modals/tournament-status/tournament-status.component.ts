import {Component, OnInit} from '@angular/core';
import {TournamentStatusService} from '../../services/tournament-status.service';
import {forkJoin} from '../../../../node_modules/rxjs';

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
  private _tournamentStatus
  private _currentMatch
  private _currentMatchNumber
  private _lastMatchStatus = {'text': 'Last match!', 'color': '#FFFFFF'}
  private _finishedAllMatchesStatus = {'text': 'All done!', 'color': '#FFFFFF'}

  constructor(private tournamentStatusService: TournamentStatusService) {
  }

  ngOnInit() {
    this.updateVariables()
    // setInterval(this.updateTime(), 1000)
  }

  private updateTime() {
    this.matchChanged(this._currentMatch)
    if (this._matchHasChanged) {
      if (this._currentMatchNumber !== 0) {
        this.tournamentStatusService.getCurrentMatch().subscribe(() => {
              this.updateVariables()
            },
            err => {
              this._secondsUntilMatchOnChange = null
              this._stringTimeUntilMatch = ''
              this._currentMatchNumber = null
              this._tournamentStatus = this._finishedAllMatchesStatus
            })
      } else {
        this.updateVariables()
      }
    }
    this._matchHasChanged = false
  }

  private matchChanged(match) {
    console.info(match)
    forkJoin(match, this.tournamentStatusService.getMatch()).subscribe(data => {
      this._matchHasChanged = data[0] !== data[1]
    }, err => {
      if (err.status === 404 && match) {
        this._matchHasChanged = true
      } else {
        this._matchHasChanged = false
      }
    })
  }

  private updateVariables() {
    this._currentMatch = this.tournamentStatusService.getMatch().toPromise().then(match => {
      console.info(match)
      this._currentMatchNumber = match
    }).catch()

    this.tournamentStatusService.secondsUntilNextMatch().then(data => {
      this._secondsUntilMatchOnChange = data
      this._tournamentStatus = this.tournamentStatusService.getTournamentStatus(data)
      this._matchChangeTime = Date.now()
    }).catch(err => {
      if (err.status === 404) {
        this._secondsUntilMatchOnChange = null
        this._stringTimeUntilMatch = ''
        if (this._currentMatchNumber) {
          this._tournamentStatus = this._lastMatchStatus
        } else {
          this._tournamentStatus = this._finishedAllMatchesStatus
        }
      }
    })
  }

  tournamentStatus() {
    if (this._secondsUntilMatchOnChange) {
      this._tournamentStatus = this.tournamentStatusService.getTournamentStatus(this.realSecondsUntilMatch())
    }
    return this._tournamentStatus
  }

  private realSecondsUntilMatch() {
    return this._secondsUntilMatchOnChange + Math.floor((this._matchChangeTime - Date.now()) / 1000)
  }

  timeUntilMatch() {
    if (typeof this._secondsUntilMatchOnChange === 'number') {
      this._stringTimeUntilMatch = `Time until next match(${this._currentMatchNumber + 1}): `
      let secondsUntilMatch = this.realSecondsUntilMatch()
      if (secondsUntilMatch < 0) {
        this._stringTimeUntilMatch += '−'
        secondsUntilMatch *= -1
      }
      this._stringTimeUntilMatch += `${Math.floor(secondsUntilMatch / 3600)}:${Math.floor(secondsUntilMatch / 60) % 60}:${secondsUntilMatch % 60}`
    }
    return this._stringTimeUntilMatch
  }
}
