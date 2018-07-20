import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(private requests: RequestService) { }

  getAllMatches() : Observable<any>{
    return this.requests.get('/match/all');
  }

}
