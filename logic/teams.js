'use strict'

const Team = require('../models/Team');

module.exports.convertTeamBlockToTeamArray = function(teamBlock){
    let teams = [];

    for(let team of teamBlock){
        teams.push(Team.deserialize(team))
    }

    return teams;
}
