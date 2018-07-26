'use strict'

const objectDataParser = require('./objectDataParser')

exports.parse = function (data, delimeter) {
  return data.split('\n')
    .map(line => objectDataParser.deserializeTeam(line.split(delimeter)))
}
