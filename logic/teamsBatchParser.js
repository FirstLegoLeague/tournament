'use strict'

const objectDataParser = require('./objectDataParser')

exports.parse = function (data, delimiter) {
  const teams = data.split('\n').filter(line => line.trim() !== '')
    .map(line => objectDataParser.deserializeTeam(line.split(delimiter)))

  if (teams.length > 0 && teams[0].number === undefined) {
    teams.unshift()
  }

  return teams
}
