import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root'
})

export class MatchesService {

  public matches: Match[] = [];

  constructor(private requests: RequestService) { }

  delete(matchId: number) : Observable<any>{
    return this.requests.delete(`/match/${matchId}`, { responseType: 'text' });
  }

  save(match: Match) : Observable<any>{
    const method = match.id() ? 'put' : 'post';
    const url = match.id() ? `/match/${match.id()}` : '/match/';
    return this.requests[method](url, match.body());
  }

  reload() {
    return this.requests.get('/match/all').subscribe((matches: Match[]) => {
    	this.matches = matches.map(match => new Match().deserialize(match));
    });
  }

}
