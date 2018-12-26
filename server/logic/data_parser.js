'use strict'
const objectDataParser = require('./object_data_parser')

const MsLogger = require('@first-lego-league/ms-logger').Logger()

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

const TABLE_NAMES_START = 1

function parse (data, delimiter) {
  let errorStr
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

  const numOfTeamsRow = lines[blocks.find(x => x.blockId === TEAM_DATA_BLOCK_ID).lineNumber + 1]
  const teamsRaw = lines.slice(blocks.find(x => x.blockId === TEAM_DATA_BLOCK_ID).lineNumber + TEAM_DATE_HEADER_LINE_AMOUNT, parseInt(numOfTeamsRow[1]) + TEAM_DATE_HEADER_LINE_AMOUNT + 1)
  MsLogger.log(`Parsing schedule file. Found ${teamsRaw.length} team(s)`)

  // Check for duplicate team numbers. Cause import to fail if found
  const teamNumbersArray = teamsRaw.map(team => team[0])
  const hasDuplicateTeam = teamNumbersArray.some((team, index) => {
    return teamNumbersArray.indexOf(team) !== index
  })
  if (hasDuplicateTeam) {
    errorStr = 'Duplicate team number found in CSV. Aborting import.'
    MsLogger.warn(errorStr)
  }
  const doesNotHaveTeamNumber = teamNumbersArray.some(team => {
    return isNaN(parseInt(team))
  })
  if (doesNotHaveTeamNumber) {
    errorStr = 'Some teams are missing team numbers. Aborting import.'
    MsLogger.warn(errorStr)
  }

  let rankingMatchesRaw, numOfActualRankingFields, rankingRablesRaw
  if (doesSectionExsits(blocks, RANKING_MATCH_SCHEDULE_ID)) {
    const numRankingOfMatches = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 1]
    rankingMatchesRaw = lines.slice(blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber +
      RANKING_MATCH_HEADER_LINE_AMOUNT,
    blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber +
      RANKING_MATCH_HEADER_LINE_AMOUNT +
      Math.ceil(parseFloat(numRankingOfMatches[1])))

    const numOfRankingTables = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 2][1]
    const numOfTeamsPerRankingTable = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + 3][1]
    numOfActualRankingFields = parseInt(numOfRankingTables) * parseInt(numOfTeamsPerRankingTable)
    rankingRablesRaw = lines[blocks.find(x => x.blockId === RANKING_MATCH_SCHEDULE_ID).lineNumber + TABLE_NAMES_LINE]
  }

  let practiceMatchesRaw, numOfActualPracticeFields, practiceTablesRaw
  if (doesSectionExsits(blocks, PRACTICE_MATCH_SCHEDULE_ID)) {
    const numOfPracticeMatches = lines[blocks.find(x => x.blockId == PRACTICE_MATCH_SCHEDULE_ID).lineNumber + 1]
    practiceMatchesRaw = lines.slice(blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber +
      PRACTICE_MATCH_HEADER_LINE_AMOUNT,
    blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber +
      PRACTICE_MATCH_HEADER_LINE_AMOUNT +
      Math.ceil(parseFloat(numOfPracticeMatches[1])))

    const numOfPracticeTables = lines[blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber + 2][1]
    const numOfTeamsPerPracticeTable = lines[blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber + 3][1]
    numOfActualPracticeFields = parseInt(numOfPracticeTables) * parseInt(numOfTeamsPerPracticeTable)
    practiceTablesRaw = lines[blocks.find(x => x.blockId === PRACTICE_MATCH_SCHEDULE_ID).lineNumber + TABLE_NAMES_LINE]
  }

  const rankingTables = []
  for (let i = 0; i < numOfActualRankingFields && arrayContainesNonEmptyFields(rankingRablesRaw); i++) {
    rankingTables.push(new Table(i, rankingRablesRaw[i + TABLE_NAMES_START]))
  }

  const practiceTables = []
  for (let i = 0; i < numOfActualPracticeFields && arrayContainesNonEmptyFields(practiceTablesRaw); i++) {
    practiceTables.push(new Table(i, practiceTablesRaw[i + TABLE_NAMES_START]))
  }

  let tables = []
  if (rankingTables.length >= practiceTables.length) {
    tables = rankingTables
  } else if (rankingTables.length < practiceTables.length) {
    tables = practiceTables
  }

  let practiceMatches, rankingMatches
  const teams = teamsRaw.map(objectDataParser.deserializeTeam)
  if (rankingMatchesRaw && arrayContainesNonEmptyFields(rankingMatchesRaw)) {
    rankingMatches = rankingMatchesRaw.map(x => objectDataParser.deserializeMatch(x, 'ranking'))
  } else {
    rankingMatches = []
  }

  if (practiceMatchesRaw) {
    practiceMatches = practiceMatchesRaw.map(x => objectDataParser.deserializeMatch(x, 'practice'))
  } else {
    practiceMatches = []
  }

  const practiceMaxTeamFields = getMaxTeamsFields(practiceMatches)
  const rankingMaxTeamFields = getMaxTeamsFields(rankingMatches)
  if (practiceMaxTeamFields > tables.length || rankingMaxTeamFields > tables.length) {
    errorStr += '\n Amount of slots in each match must be the same as the number of tables. Aborting import.'
    MsLogger.warn(`Amount of slots in each match must be the same as the number of tables. Aborting import. (practice: ${practiceMaxTeamFields}, ranking: ${rankingMaxTeamFields})`)
  }

  return {
    'teams': teams,
    'tables': tables,
    'rankingMatches': rankingMatches,
    'practiceMatches': practiceMatches,
    'error': errorStr
  }
}

module.exports = {
  'parse': parse
}

function doesSectionExsits (blocks, sectionId) {
  return blocks.find(x => x.blockId == sectionId) != undefined
}

function arrayContainesNonEmptyFields (arr) {
  return arr.some(line => {
    if (Array.isArray(line)) {
      return line.some(x => !isStringEmpty(x))
    }
    return !isStringEmpty(line)
  })
}

function isStringEmpty (str) {
  return str == '' || str == undefined || /^\s+$/.test(str)
}

function getMaxTeamsFields (matchArray) {
  let max = -Infinity
  matchArray.forEach(match => {
    max = match.matchTeams.length > max ? match.matchTeams.length : max
  })
  return max
}
