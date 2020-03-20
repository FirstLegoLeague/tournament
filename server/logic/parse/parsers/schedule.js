const { InvalidEntry } = require('@first-lego-league/synced-resources')
const moment = require('moment')

const { ParsingException } = require('../parsing_exception')

const { Match } = require('../../../../resources/match')
const { Team } = require('../../../../resources/team')
const { Table } = require('../../../../resources/table')

const TEAM_FIELDS = Team.FIELDS.map(({ key }) => key).filter(key => key !== '_id')

// CSV format constants
const LINE_SEPERATOR = '\n'
const DELIMETER = ','
const BLOCK_HEADER = 'Block Format'
const TABLES_NAMES_LINE = 'Table Names'
const TABLES_COUNT_LINE = 'Number of Tables'

exports.parse = data => {
  const lines = data.split(LINE_SEPERATOR).map(line => line.split(DELIMETER))

  const blocks = lines.reduce((blocksArray, line, index) => {
    if (line[0] === BLOCK_HEADER) {
      const blockId = parseInt(line[1])
      const blockData = blockFormats.find(b => b.blockId === blockId)
      if (blockData) {
        const block = Object.assign({ }, blockData)
        const headerStart = index
        const headerEnd = index + block.headerLength
        const bodyStart = headerEnd + 1
        const bodyLength = Number(lines[index + block.bodyLengthLocationInHeader.line][block.bodyLengthLocationInHeader.cell])
        const bodyEnd = headerEnd + bodyLength
        block.header = lines.filter((l, i) => i >= headerStart && i <= headerEnd)
        block.body = lines.filter((l, i) => i >= bodyStart && i <= bodyEnd)
        blocksArray.push(block)
      }
    }
    return blocksArray
  }, [])

  if (blocks.length === 0) {
    throw new ParsingException('Format Mismatch')
  }

  return blocks.reduce((schedule, block) => {
    schedule = block.apply(schedule, block.body, block.header)
    return schedule
  }, { })
}

// Data section in the CSV file
const blockFormats = [
  {
    blockId: 1, // teams
    headerLength: 1,
    bodyLengthLocationInHeader: { line: 1, cell: 1 },
    apply: (schedule, body) => {
      schedule.teams = body.map(line => new Team(TEAM_FIELDS.reduce((attrs, field, index) => Object.assign({ [field]: line[index] }, attrs), { })))
      validate(schedule.teams)
      try {
        schedule.teams.forEach(team => team.validate({ collection: schedule.teams }))
      } catch (error) {
        if (error instanceof InvalidEntry) {
          throw new ParsingException(`Could not parse file. ${error.message}`)
        }
      }
      return schedule
    }
  },
  {
    blockId: 2, // ranking matches
    headerLength: 5,
    bodyLengthLocationInHeader: { line: 1, cell: 1 },
    apply: (schedule, body, header) => {
      applyTables(header, schedule)
      applyMatches(body, schedule, 'rankings')
      return schedule
    }
  },
  // Blcok format with blockId 3 is for judging rooms, which is not yet implemented in the TMS.
  {
    blockId: 4, // practice matches
    headerLength: 5,
    bodyLengthLocationInHeader: { line: 1, cell: 1 },
    apply: (schedule, body, header) => {
      applyTables(header, schedule)
      applyMatches(body, schedule, 'practice')
      return schedule
    }
  }
]
const applyTables = (blockHeader, schedule) => {
  const tablesNamesLine = blockHeader.find(line => line[0] === TABLES_NAMES_LINE)
  const tablesCountLine = blockHeader.find(line => line[0] === TABLES_COUNT_LINE)
  const tables = tablesNamesLine
    .splice(1, 1 + tablesCountLine[1])
    .map((tableName, index) => new Table({ _id: index, name: tableName }))

  if (!schedule.tables || schedule.tables.length < tables.length) {
    schedule.tables = tables
  }

  validate(schedule.tables)
}

const applyMatches = (blockBody, schedule, stage) => {
  const matches = blockBody
    .map(line => new Match({
      matchId: line[0],
      stage,
      startTime: parseDate(line[1]),
      endTime: parseDate(line[2]),
      teams: schedule.tables
        .map((table, index) => ({ tableId: table._id, teamNumber: line[3 + index] }))
        .filter(matchTeam => isFinite(matchTeam.teamNumber))
    }))

  schedule.matches = (schedule.matches || []).concat(matches)

  validate(schedule.matches)
}

const validate = collection => {
  try {
    collection.forEach(entry => entry.validate({ collection }))
  } catch (error) {
    if (error instanceof InvalidEntry) {
      throw new ParsingException(`Could not parse file. ${error.message}`)
    }
  }
}

const parseDate = str => {
  return moment(str, 'hh:mm:ss A')
    .set({ year: 1970, month: 0, date: 1 })
    .toDate()
    .toISOString()
}
