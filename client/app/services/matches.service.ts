import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  public matches: Match[];

  constructor(private requests: RequestService) { }

  getAllMatches() : Match[]{
  	return this.matches;
  }

  delete(machId: number) {
    return this.requests.delete(`/match/${machId}`, { responseType: 'text' });
  }

  reload() {
    return this.requests.get('/match/all').subscribe((matches: Match[]) => {
    	this.matches = matches.map(match => new Match().deserialize(match));
    });
  }

}
