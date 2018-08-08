import {RequestService} from './request.service';
import { Observable } from "../../../node_modules/rxjs";
import {getMatch, setMatch} from "../../../logic/getmatchLogic"

export class TournamentStatusService{
  constructor(private requests: RequestService) { }

  getCurrentMatch(): Observable<any>{
    return this.requests.get('/match/current')
  }

  getUpcomingMatches():  Observable<any>{
    return this.requests.get('/match/upcoming')
  }

  timeUntilNextMatch(){
    
  }

  setMatch(match){
    setMatch(match)
  }

  getMatch(){
    return getMatch()
  }
}