import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {Observable} from 'rxjs';
import {Team} from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private request: RequestService) {
  }

  getAllTeams() : Observable<any>{
    return this.request.get('/team/all')
  }

  uploadBatch(data: string) : Observable<any>{
    return this.request.post('/team/batch', { delimiter: ',', teamsData: data }, {})
  }

}
