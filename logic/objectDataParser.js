'use strict'
const Match = require('../models/Match');
const Team = require('../models/Team');
const Table = require('../models/Table');
const MatchTeam = require('../models/MatchTeam');
const moment = require('moment');

function deserializeMatch(rawMatch) {
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


function deserializeTeam(rawTeam) {
    let newTeam = new Team();

    newTeam.number = parseIntOrUndefined(rawTeam[0]);
    newTeam.name = stringOrUndefined(rawTeam[1]);
    newTeam.affiliation = stringOrUndefined(rawTeam[2]);
    newTeam.cityState = stringOrUndefined(rawTeam[3]);
    newTeam.country = stringOrUndefined(rawTeam[4]);
    newTeam.coach1 = stringOrUndefined(rawTeam[5]);
    newTeam.coach2 = stringOrUndefined(rawTeam[6]);
    newTeam.judgingGroup = stringOrUndefined(rawTeam[7]);
    newTeam.pitNumber = parseIntOrUndefined(rawTeam[8]);
    newTeam.pitLocation = stringOrUndefined(rawTeam[9]);
    newTeam.translationNeeded = parseBooleanOrUndefined(rawTeam[10]);

    return newTeam;
}


function parseIntOrUndefined(int){
    if (int == ''){
        return undefined;
    }
    return parseInt(int);
}

function stringOrUndefined(string){
    if(string == ''){
        return undefined;
    }
    return string
}

function parseFloatOrUndefined(float){
    if (float == ''){
        return undefined;
    }
    return parseFloat(float);
}

function parseBooleanOrUndefined(bool){
    if(bool == ''){
        return undefined;
    }

    return bool == 'true';
}

module.exports = {
    'deserializeMatch': deserializeMatch,
    'deserializeTeam': deserializeTeam
}