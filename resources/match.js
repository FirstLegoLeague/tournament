const { FieldsModel } = require('@first-lego-league/synced-resources')
const moment = require('moment')

class Match extends FieldsModel {
  fields () {
    return Match.FIELDS
  }

  offsetTimes (offset) {
    this.startTime = moment(this.startTime).add(offset, 'ms')
    this.endTime = moment(this.endTime).add(offset, 'ms')
  }
}

Match.FIELDS = [
  { key: '_id', type: String, defaultValue: undefined },
  { key: 'matchId', type: String, required: true },
  { key: 'startTime', type: String, required: true },
  { key: 'endTime', type: String, required: true },
  { key: 'stage', type: String, defaultValue: 'practice', required: true },
  { key: 'teams', required: true }
]

exports.Match = Match
