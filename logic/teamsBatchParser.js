'use strict'

const objectDataParser = require('./objectDataParser')

exports.parse = function (data, delimiter) {
  return data.split('\n')
    .map(line => objectDataParser.deserializeTeam(line.split(delimiter)))
}
