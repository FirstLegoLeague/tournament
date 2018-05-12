'use strict'

const Match = require('../models/Match');

module.exports.ConvertMatchBlockToMatchArray = function (rawMatchData) {
    let toReturn = [];

    for (let d of rawMatchData){
        toReturn.push(Match.deserialize(d));
    }

    return toReturn;
}