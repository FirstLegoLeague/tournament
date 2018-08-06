import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})

export class TeamsService {

  public teams: Team[] = [];

  constructor(private requests: RequestService) { }

  delete(teamNumber: number) : Observable<any>{
    return this.requests.delete(`/team/${teamNumber}`, { responseType: 'text' });
  }

  save(team: Team) : Observable<any>{
    const method = team.id() ? 'put' : 'post';
    const url = team.id() ? `/team/${team.id()}` : '/team/';
    return this.requests[method](url, team.body());
  }

  reload() {
    return this.requests.get('/team/all').subscribe((teams :Team[]) => {
      this.teams = teams.map(team => new Team().deserialize(team));
    });
  }

  uploadBatch(data: string) : Observable<any>{
    return this.requests.post('/team/batch', { delimiter: ',', teamsData: data });
  }

}
