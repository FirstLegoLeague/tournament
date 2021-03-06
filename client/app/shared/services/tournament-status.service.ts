import { EventEmitter, Injectable } from '@angular/core'
import { RequestService } from './request.service'
import { Observable, throwError } from '../../../../node_modules/rxjs/index'
import { MessengerService } from './messenger.service'
import { Match } from '../models/match'

const STATUS = {
  GOOD: { 'text': 'Ahead of time!', 'color': '#ADFF2F' },
  MEDIOCRE: { 'text': 'Right on time!', 'color': '#FFFF00' },
  BAD: { 'text': 'Running late!', 'color': '#FF4500' }
}

const STATUS_TIMES = {
  GOOD_TIME: { 'lowerLimit': 2 * 60 },
  MEDIOCRE_TIME: { 'lowerLimit': -2 * 60, 'upperLimit': 2 * 60 },
  BAD_TIME: { 'upperLimit': -2 * 60 }
}

@Injectable({
  providedIn: 'root'
})
export class TournamentStatusService {

  public onCurrentMatchChangeEvent: EventEmitter<Match>

  constructor (private requests: RequestService,
                private messenger: MessengerService) {

    this.onCurrentMatchChangeEvent = new EventEmitter()

    this.messenger.on('CurrentMatch:reload', (data) => {
      this.onCurrentMatchChangeEvent.emit(data.data)
    })

  }

  getCurrentMatch (): Observable<any> {
    return this.requests.get('/match/current')
  }

  getUpcomingMatches (): Observable<any> {
    return this.requests.get('/match/upcoming')
  }

  getTournamentStatusBySecond (secondsUntilMatch) {
    if (secondsUntilMatch > STATUS_TIMES.GOOD_TIME.lowerLimit) {
      return STATUS.GOOD
    }
    if (secondsUntilMatch > STATUS_TIMES.BAD_TIME.upperLimit) {
      return STATUS.MEDIOCRE
    }
    return STATUS.BAD
  }

  setMatch (match) {
    return this.requests.put(`/match/current`, { 'match': match })
  }

}
