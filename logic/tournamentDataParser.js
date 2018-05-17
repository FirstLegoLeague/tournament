'use strict'
const objectDataParser = require('./objectDataParser')

const Team = require('../models/Team')
const Match = require('../models/Match')
const Table = require('../models/Table')

const TEAM_DATA_BLOCK_ID = 1
const TEAM_DATE_HEADER_LINE_AMOUNT = 2

const RANKING_MATCH_SCHEDULE_ID = 2
const RANKING_MATCH_HEADER_LINE_AMOUNT = 6
const TABLE_NAMES_LINE = 5

const JUDJING_INFO_BLOCK_ID = 3
const JUDJING_INFO_HEADER_LINE_AMOUNT = 6

const PRACTICE_MATCH_SCHEDULE_ID = 4
const PRACTICE_MATCH_HEADER_LINE_AMOUNT = 6

function parse (data, delimiter) {
  const dataLines = data.split('\n')

  const lines = []
  for (let i = 0; i < dataLines.length; i++) {
    lines.push(dataLines[i].split(delimiter))
  }

  const blocks = []
  lines.forEach((line, index) => {
    if (line[0] === 'Block Format') {
      blocks.push({
        'blockId': parseInt(line[1]),
        'lineNumber': index
      })
    }
  })

  const numOfTeams = lines[blocks.find(x => x.blockId === TEAM_DATA_BLOCK_ID).lineNumber + 1]
  const teamsRaw = lines.slice(blocks.find(x => x.blockId === TEAM_DATA_BLOCK_ID).lineNumber + TEAM_DATE_HEADER_LINE_AMOUNT, parseInt(numOfTeams[1]))

  const numRankingOfMatches = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 1]
  const rankingMatchesRaw = lines.slice(blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber +
        RANKING_MATCH_HEADER_LINE_AMOUNT,
  blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber +
        RANKING_MATCH_HEADER_LINE_AMOUNT +
        Math.ceil(parseFloat(numRankingOfMatches[1])))

  const numOfPracticeMatches = lines[blocks.find(x => x.blockId == PRACTICE_MATCH_SCHEDULE_ID).lineNumber + 1]
  const practiceMatchesRaw = lines.slice(blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber +
        PRACTICE_MATCH_HEADER_LINE_AMOUNT,
  blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber +
        PRACTICE_MATCH_HEADER_LINE_AMOUNT +
        Math.ceil(parseFloat(numOfPracticeMatches[1])))

  const numOfTables = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 2][1]
  const numOfTeamsPerTable = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 3][1]
  const numOfActualFields = parseInt(numOfTables) * parseInt(numOfTeamsPerTable)
  const tablesRaw = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + TABLE_NAMES_LINE]

  const tables = []
  for (let i = 3; i < numOfActualFields + 3; i++) {
    tables.push(new Table(i - 3, tablesRaw[i]))
  }

  const teams = teamsRaw.map(objectDataParser.deserializeTeam)
  const rankingMatches = rankingMatchesRaw.map(objectDataParser.deserializeMatch)
  const practiceMatches = practiceMatchesRaw.map(objectDataParser.deserializeMatch)

  return {
    'teams': teams,
    'tables': tables,
    'rankingMatches': rankingMatches,
    'practiceMatches': practiceMatches
  }
}

module.exports = {
  'parse': parse
}
