'use strict'

class Match {
    constructor(matchId, startTime, endTime, matchTeams) {
        this.matchId = matchId
        this.startTime = startTime
        this.endTime = endTime
        this.matchTeams = matchTeams
    }
}

Match.IdField = 'matchId'

module.exports = Match
