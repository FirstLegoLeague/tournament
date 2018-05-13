'use strict'
const MatchTeam = require('./MatchTeam');
const moment = require('moment');

class Match {
    constructor(matchId, startTime, endTime, matchTeams) {
        this.matchId = matchId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.matchTeams = matchTeams;
    }

    static deserialize(rawMatch) {
        let newMatch = new Match();

        newMatch.matchId = rawMatch[0];
        newMatch.startTime = moment(rawMatch[1],'hh:mm:ss A').toDate();
        newMatch.endTime = moment(rawMatch[2],'hh:mm:ss A').toDate();
        newMatch.matchTeams = [];

        let matchTeamsRaw = rawMatch.slice(2, rawMatch.length);
        for (let i = 0; i < matchTeamsRaw.length; i++) {
            newMatch.matchTeams.push(new MatchTeam(parseFloatOrUndefined(matchTeamsRaw[i]), i));
        }

        return newMatch;
    }


}

function parseFloatOrUndefined(float){
    if (float == ''){
        return undefined;
    }
    return parseFloat(float);
}

module.exports = Match;