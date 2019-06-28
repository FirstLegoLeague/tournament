import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { RequestService } from './request.service'
import { Match } from '../models/match'
import { EditableModalService, DeletableModalService } from '../models/interfaces/modal-model'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class MatchesService implements EditableModalService, DeletableModalService {

  private initStarted: boolean = false
  public matches: Match[] = []

  constructor (private requests: RequestService) {
  }

  init () {
    if (!this.initStarted) {
      this.initStarted = true
      return this.reload()
    }
  }

  delete (matchId: number): Observable<any> {
    return this.requests.delete(`/match/${matchId}`, { responseType: 'text' })
  }

  save (match: Match): Observable<any> {
    const method = match.savedInDB() ? 'put' : 'post'
    const url = match.savedInDB() ? `/match/${match.id()}` : '/match/'
    let body = match.body()
    if (!match.savedInDB()) {
      return this.getNextMatchId(match.stage).pipe(map(returned => {
                // @ts-ignore
        body['matchId'] = returned.nextMatchId
        return this.requests[method](url, body, { responseType: 'text' }).subscribe(data => {
          return data
        })
      }))
    } else {
      return this.requests[method](url, body, { responseType: 'text' })
    }

  }

  requestAll () {
    return this.requests.get('/match/all')
  }

  reload (): Observable<any> {
    return this.requestAll().pipe(map((matches: Match[]) => {
      this.matches = matches.map(match => new Match().deserialize(match))
      return this.matches
    }))
  }

  deleteErrorText (): string {
    return ''
  }

  getNextMatchId (stage: string) {
    return this.requests.get(`/match/${stage}/nextId`)
  }

}
