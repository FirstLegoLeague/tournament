import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { RequestService } from './request.service'
import { EditableModalService, DeletableModalService } from '../models/interfaces/modal-model'
import { Team } from '../models/team'
import { Match } from '../models/match'
import { flatMap, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class TeamsService implements EditableModalService, DeletableModalService {

  private initStarted: boolean = false
  public teams: Team[] = []

  constructor (private requests: RequestService) {
  }

  init () {
    if (!this.initStarted) {
      this.initStarted = true
      return this.reload()
    }
  }

  delete (teamNumber: number): Observable<any> {
    return this.requests.delete(`/team/${teamNumber}`, { responseType: 'text' })
  }

  save (team: Team): Observable<any> {
    const method = team.savedInDB() ? 'put' : 'post'
    const url = team.savedInDB() ? `/team/${team.id()}` : '/team/'
    return this.requests[method](url, team.body(), { responseType: 'text' })
  }

  requestAll () {
    return this.requests.get('/team/all')
  }

  reload () {
    return this.requestAll().pipe(map((teams: Team[]) => {
      this.teams = teams.map(team => new Team().deserialize(team))
      return this.teams
    }))
  }

  uploadBatch (data: string): Observable<any> {
    return this.requests.post('/team/batch', { delimiter: ',', teamsData: data })
  }

  deleteErrorText (): string {
    return ''
  }
}
