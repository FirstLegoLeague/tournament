import {RequestService} from './request.service';
import { Observable } from "../../../node_modules/rxjs";
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const adminAction = authroizationMiddlware(['admin', 'development'])

const STATUS = {
  GOOD: {'text': 'Running on time!', 'color': '#ADFF2F'},
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
  constructor(private requests: RequestService) { }

  getCurrentMatch(): Observable<any>{
    return this.requests.get('/match/current')
  }

  getUpcomingMatches():  Observable<any>{
    return this.requests.get('/match/upcoming')
  }

  secondsUntilNextMatch(){
    let secondsUntilMatch
    this.getCurrentMatch().subscribe(data =>{
      secondsUntilMatch = Math.floor((Date.now() - (new Date(data.startTime)).getTime())/1000)
    })
    return secondsUntilMatch
  }

  timeUntilNextMatch(){
    let secondsUntilMatch = this.secondsUntilNextMatch()
    let retTime = ''
      if(secondsUntilMatch <0){
        secondsUntilMatch *=-1
        retTime ='-'
      }

      retTime += `${Math.floor(secondsUntilMatch/(60*60))}:${Math.floor(secondsUntilMatch/60 % 60)}:${secondsUntilMatch % 60}`
      return retTime
  }

  getTournamentStatus(){
    return setStatus(this.secondsUntilNextMatch())
  }

  setMatch(match){
    this.requests.get(`/match/setMatchNumber/${match}`)
  }

  getMatch(){
    return this.requests.get('/match/matchNumber')
  }
}