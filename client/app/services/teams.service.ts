import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { RequestService } from './request.service'
import { EditableModalService, DeletableModalService } from '../models/interfaces/modal-model'
import { Team } from '../models/team'

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
      this.reload()
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

  reload () {
    return this.requests.get('/team/all').subscribe((teams: Team[]) => {
      this.teams = teams.map(team => new Team().deserialize(team))
    })
  }

  uploadBatch (data: string): Observable<any> {
    return this.requests.post('/team/batch', { delimiter: ',', teamsData: data })
  }

}
