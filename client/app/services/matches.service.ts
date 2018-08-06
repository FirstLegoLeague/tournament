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

  getAllMatches() : Match[]{
  	return this.matches;
  }

  delete(machId: number) : Observable<any>{
    return this.requests.delete(`/match/${machId}`, { responseType: 'text' });
  }

  save(match: Match) : Observable<any>{
    const method = match.id() ? 'put' : 'post';
    return this.requests[method](`/match/${match.id()}`, match.body())
  }

  reload() {
    return this.requests.get('/match/all').subscribe((matches: Match[]) => {
    	this.matches = matches.map(match => new Match().deserialize(match));
    });
  }

}
