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
    this.getCurrentMatch().subscribe(data =>{
      let secondsUntilMatch = Math.floor((Date.now() - (new Date(data.startTime)).getTime())/1000)
      let retTime = ''
      if(secondsUntilMatch <0){
        secondsUntilMatch *=-1
        retTime ='-'
      }

      retTime += `${Math.floor(secondsUntilMatch/(60*60))}:${Math.floor(secondsUntilMatch/60)}:${secondsUntilMatch}`
      return retTime
    })
  }

  setMatch(match){
    this.requests.get(`/match/setMatchNumber/${match}`)
  }

  getMatch(){
    return this.requests.get('/match/matchNumber')
  }
}