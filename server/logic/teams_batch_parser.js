'use strict'

const objectDataParser = require('./object_data_parser')

const MsLogger = require('@first-lego-league/ms-logger').Logger()

exports.parse = function (data, delimiter) {
  let errorStr
  // Filter out lines without any data
  const teams = data.split('\n').filter(line => line.trim() !== '')
    .map(line => objectDataParser.deserializeTeam(line.split(delimiter)))

  if (teams.length > 0 && teams[0].number === undefined) {
    teams.unshift()
  }
  MsLogger.info(`Parsing team list file. Found ${teams.length} team(s)`)

  // Check for duplicate team numbers. Cause import to fail if found
  const teamNumbersArray = teams.map(team => team.number)
  const hasDuplicateTeam = teamNumbersArray.some((team, index) => {
    return teamNumbersArray.indexOf(team) !== index
  })
  if (hasDuplicateTeam) {
    errorStr = 'Duplicate team number found in team list. Aborting import'
    MsLogger.warn(errorStr)
    teams.length = 0
  }
  const doesNotHaveTeamNumber = teamNumbersArray.some(team => {
    return isNaN(parseInt(team))
  })
  if (doesNotHaveTeamNumber) {
    errorStr = 'Some teams are missing team numbers. Aborting import.'
    MsLogger.warn(errorStr)
  }

  return { 'teams': teams, 'error': errorStr }
}
