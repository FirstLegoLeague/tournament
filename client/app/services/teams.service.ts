import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private requests: RequestService) { }

  getAllTeams() : Observable<any>{
    return this.requests.get('/team/all');
  }

  uploadBatch(data: string) : Observable<any>{
    return this.requests.post('/team/batch', { delimiter: ',', teamsData: data }, {});
  }

  delete(teamNumber: number) {
    return this.requests.delete(`/team/${teamNumber}`, { responseType: 'text' });
  }

}
