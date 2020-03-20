import { Component, OnDestroy, OnInit } from '@angular/core'
import { StatusService } from '../../shared/services/resource_clients/status.service'

const REFRESH_TIME = 1000 // milliseconds

@Component({
  selector: 'tournament-status',
  templateUrl: './tournament-status.component.html',
  styleUrls: ['./tournament-status.component.css']
})
export class TournamentStatusComponent implements OnInit, OnDestroy {
  private timer
  public timeTillNextMatch: Date

  constructor (private statusService: StatusService) {
  }

  ngOnInit () {
    this.statusService.init().subscribe(() => {
      this.timer = setInterval(() => {
        const now = new Date()
        const nextMatchDate = new Date(this.statusService.data().nextMatchTime)
        this.timeTillNextMatch = new Date(now.getTime() - nextMatchDate.getTime())
      }, REFRESH_TIME)
    })
  }

  ngOnDestroy () {
    clearInterval(this.timer)
    this.timer = undefined
  }
}
