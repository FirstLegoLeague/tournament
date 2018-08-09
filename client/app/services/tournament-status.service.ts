import {RequestService} from './request.service';
import { Observable } from "../../../node_modules/rxjs";
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const adminAction = authroizationMiddlware(['admin', 'development'])

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

export class TournamentStatusService{
  secondsUntilMatch = 0

  constructor(private requests: RequestService) {}

  getCurrentMatch(): Observable<any>{
    return this.requests.get('/match/current')
  }

  getUpcomingMatches():  Observable<any>{
    return this.requests.get('/match/upcoming')
  }

  secondsUntilNextMatch(){
    this.getCurrentMatch().subscribe(data =>{
      this.secondsUntilMatch = Math.floor((Date.now() - (new Date(data.startTime)).getTime())/1000)
    })
    return this.secondsUntilMatch
  }

  getTournamentStatus(){
    return setStatus(this.secondsUntilMatch)
  }

  setMatch(match){
    this.requests.get(`/match/setMatchNumber/${match}`)
  }

  getMatch(){
    return this.requests.get('/match/matchNumber')
  }
}