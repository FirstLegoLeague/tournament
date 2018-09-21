import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import { Observable, throwError } from "../../../../node_modules/rxjs/index";

const STATUS = {
  GOOD: {'text': 'Ahead of time!', 'color': '#ADFF2F'},
  MEDIOCRE: {'text': 'Right on time!', 'color':'#FFFF00'},
  BAD: {'text':'Running late!', 'color':'#FF4500'}
}

const STATUS_TIMES = {
  GOOD_TIME: {'lowerLimit': 2*60},
  MEDIOCRE_TIME: {'lowerLimit': -2*60, 'upperLimit': 2*60},
  BAD_TIME: {'upperLimit': -2*60}
}

function setStatus(secondsUntilMatch){
  if(secondsUntilMatch > STATUS_TIMES.GOOD_TIME.lowerLimit){
    return STATUS.GOOD
  }
  if(secondsUntilMatch > STATUS_TIMES.BAD_TIME.upperLimit){
    return STATUS.MEDIOCRE
  }
  return STATUS.BAD
}

@Injectable({
  providedIn: 'root'
})
export class TournamentStatusService{

  constructor(private requests: RequestService) {}

  getCurrentMatch(): Observable<any>{
    return this.requests.get('/match/current')
  }

  getUpcomingMatches():  Observable<any>{
    return this.requests.get('/match/upcoming')
  }

  secondsUntilNextMatch(){
    return this.getUpcomingMatches().toPromise().then(data =>{
      return -Math.floor((Date.now() - (new Date(data[0].startTime)).getTime())/1000)
    })
  }

  getTournamentStatus(secondsUntilMatch){
    return setStatus(secondsUntilMatch)
  }

  setMatch(match){
    if(isNaN(match) || match<0 || match > 500){
      return throwError
    }
    return this.requests.put(`/match/current/set`,{'match': match},{ observe: 'response' })
  }

  getMatch(){
    return this.requests.get('/match/matchNumber')
  }
}
