import { Component, OnDestroy, OnInit } from '@angular/core'
import { TournamentStatusService } from '../../shared/services/tournament-status.service'
import { MessengerService } from '../../shared/services/messenger.service'
import { Match } from '../../shared/models/match'

@Component({
  selector: 'tournament-status',
  templateUrl: './tournament-status.component.html',
  styleUrls: ['./tournament-status.component.css']
})
export class TournamentStatusComponent implements OnInit, OnDestroy {

  public currentMatch: Match
  public nextMatches: Match[]
  public timeTillNextMatch
  private timer

  constructor (private tournamentStatusService: TournamentStatusService, private messenger: MessengerService) {
  }

  ngOnInit () {
    this.reloadData()

    this.messenger.on('CurrentMatch:reload', this.reloadMatch.bind(this))
    this.messenger.on('UpcomingMatches:reload', this.reloadMatches.bind(this))
    this.messenger.on('tournamentStage:updated',this.reloadData.bind(this))
    this.messenger.on('matches:reload',this.reloadData.bind(this))

    this.timer = setInterval(() => {
      if (this.nextMatches != null && this.nextMatches.length > 1) {
        let now = new Date()
        let nextMatchStart = new Date(this.nextMatches[0].startTime)
        this.timeTillNextMatch = new Date(now.getTime() - nextMatchStart.getTime())
      }
    }, 1000)
  }

  reloadMatch (data) {
    this.currentMatch = data.data
  }

  reloadMatches (data) {
    this.nextMatches = data.data
  }

  reloadData () {
    this.tournamentStatusService.getCurrentMatch().subscribe(match => {
      this.currentMatch = match
    })

    this.tournamentStatusService.getUpcomingMatches().subscribe(matches => {
      this.nextMatches = matches
    })
  }

  ngOnDestroy (): void {
    clearInterval(this.timer)
  }

}
