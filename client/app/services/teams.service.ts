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

  getAllTeams() : Team[]{
    return this.teams;
  }

  delete(teamNumber: number) : Observable<any>{
    return this.requests.delete(`/team/${teamNumber}`, { responseType: 'text' });
  }

  save(team: Team) : Observable<any>{
    const method = team.id() ? 'put' : 'post';
    return this.requests[method](`/team/${team.id()}`, team.body())
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
