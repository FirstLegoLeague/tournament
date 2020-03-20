const Promise = require('bluebird')

const scheduleParser = require('./parsers/schedule')
const teamsParser = require('./parsers/teams')
const { ParsingException } = require('./parsing_exception')

const PARSERS = [teamsParser, scheduleParser]

exports.parse = (rawData, logger) => {
  return new Promise(resolve => {
    for (const parser of PARSERS) {
      try {
        const parsedData = parser.parse(rawData)
        return resolve(parsedData)
      } catch (error) {
        if (error instanceof ParsingException) {
          logger.debug(`parsing error: ${error}`)
        } else {
          throw error
        }
      }
    }
    throw new ParsingException('Data does not match any known format.')
  })
}

exports.ParsingException = ParsingException
