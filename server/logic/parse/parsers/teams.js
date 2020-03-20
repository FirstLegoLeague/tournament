const { InvalidEntry } = require('@first-lego-league/synced-resources')

const { ParsingException } = require('../parsing_exception')
const { Team } = require('../../../../resources/team')

const LINE_SEPERATOR = '\n'
const DELIMETER = ','

const TEAM_FIELDS = Team.FIELDS.map(({ key }) => key).filter(key => key !== '_id')

exports.parse = data => {
  const lines = data
    .split(LINE_SEPERATOR)
    .map(line => line.split(DELIMETER))
    .filter(line => line.some(cell => cell !== ''))
    .slice(1)

  if (lines.length === 0) {
    throw new ParsingException('No teams found')
  }

  const teams = lines.map(line => new Team(TEAM_FIELDS.reduce((attrs, field, index) => Object.assign({ [field]: line[index] }, attrs), { })))

  try {
    teams.forEach(team => team.validate({ collection: teams }))
  } catch (error) {
    if (error instanceof InvalidEntry) {
      throw new ParsingException(`Could not parse file. ${error.message}`)
    }
  }

  return { teams }
}
