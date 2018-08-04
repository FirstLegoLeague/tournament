import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  public teams: Team[];

  constructor(private requests: RequestService) { }

  getAllTeams() : Team[]{
    return this.teams;
  }

  uploadBatch(data: string) : Observable<any>{
    return this.requests.post('/team/batch', { delimiter: ',', teamsData: data }, {});
  }

  delete(teamNumber: number) {
    return this.requests.delete(`/team/${teamNumber}`, { responseType: 'text' });
  }

  reload() {
    return this.requests.get('/team/all').subscribe((teams :Team[]) => {
      this.teams = teams.map(team => new Team().deserialize(team));
    });
  }

}
