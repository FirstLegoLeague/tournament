'use strict'
const Team = require('../models/Team');
const Match = require('../models/Match');
const Table = require('../models/Table');

const objectDataParser = require('objectDataParser');

const TEAM_DATA_BLOCK_ID = 1;
const TEAM_DATE_HEADER_LINE_AMOUNT = 2;

const RANKING_MATCH_SCHEDULE_ID = 2;
const RANKING_MATCH_HEADER_LINE_AMOUNT = 6;
const TABLE_NAMES_LINE = 5;

const JUDJING_INFO_BLOCK_ID = 3;
const JUDJING_INFO_HEADER_LINE_AMOUNT = 6;

const PRACTICE_MATCH_SCHEDULE_ID = 4;
const PRACTICE_MATCH_HEADER_LINE_AMOUNT = 6;


function parse(data, delimiter) {
    let dataLines = data.split('\n');

    let lines = [];
    for (let i = 0; i < dataLines.length; i++) {
        lines.push(dataLines[i].split(delimiter));
    }

    let blocks = [];
    lines.forEach((line, index) => {
        if (line[0] === 'Block Format') {
            blocks.push({
                "blockId": parseInt(line[1]),
                "lineNumber": index
            });
        }
    });

    let numOfTeams = lines[blocks.find(x => x.blockId === TEAM_DATA_BLOCK_ID).lineNumber + 1];
    let teamsRaw = lines.slice(blocks.find(x => x.blockId === TEAM_DATA_BLOCK_ID).lineNumber + TEAM_DATE_HEADER_LINE_AMOUNT, parseInt(numOfTeams[1]))

    let numRankingOfMatches = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 1];
    let rankingMatchesRaw = lines.slice(blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber
        + RANKING_MATCH_HEADER_LINE_AMOUNT,
        blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber
        + RANKING_MATCH_HEADER_LINE_AMOUNT
        + Math.ceil(parseFloat(numRankingOfMatches[1])));

    let numOfPracticeMatches = lines[blocks.find(x => x.blockId == PRACTICE_MATCH_SCHEDULE_ID).lineNumber + 1]
    let practiceMatchesRaw = lines.slice(blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber
        + PRACTICE_MATCH_HEADER_LINE_AMOUNT,
        blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber
        + PRACTICE_MATCH_HEADER_LINE_AMOUNT
        + Math.ceil(parseFloat(numOfPracticeMatches[1])));

    let numOfTables = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 2][1];
    let numOfTeamsPerTable = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 3][1];
    let numOfActualFields = parseInt(numOfTables) * parseInt(numOfTeamsPerTable);
    let tablesRaw = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + TABLE_NAMES_LINE]

    let tables = [];
    for (let i = 3; i < numOfActualFields + 3; i++) {
        tables.push(new Table(i - 3, tablesRaw[i]))
    }

    let teams = teamsRaw.map(objectDataParser.deserializeTeam);
    let rankingMatches = rankingMatchesRaw.map(objectDataParser.deserializeMatch);
    let practiceMatches = practiceMatchesRaw.map(objectDataParser.deserializeMatch)

    return {
        'teams': teams,
        'tables': tables,
        'rankingMatches': rankingMatches,
        'practiceMatches': practiceMatches
    };

}


module.exports = {
    'parse': parse
};