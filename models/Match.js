'use strict'

class Match {
  constructor (matchId, startTime, endTime, stage, matchTeams) {
    this.matchId = matchId
    this.startTime = startTime
    this.endTime = endTime
    this.stage = stage
    this.matchTeams = matchTeams
  }
}

Match.IdField = 'matchId'

module.exports = Match
