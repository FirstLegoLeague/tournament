import {RequestService} from './request.service';
import { Observable } from "../../../node_modules/rxjs";
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const adminAction = authroizationMiddlware(['admin', 'development'])

export class TournamentStatusService{
  constructor(private requests: RequestService) { }

  getCurrentMatch(): Observable<any>{
    return this.requests.get('/match/current')
  }

  getUpcomingMatches():  Observable<any>{
    return this.requests.get('/match/upcoming')
  }

  timeUntilNextMatch(){
    return Date.now()
  }

  setMatch(match){
    this.requests.get(`/match/setMatchNumber/${match}`)
  }

  getMatch(){
    return this.requests.get('/match/matchNumber')
  }
}