const { FieldsModel } = require('@first-lego-league/synced-resources')

class Match extends FieldsModel {
  fields () {
    return Match.FIELDS
  }
}

Match.FIELDS = [
  { field: 'matchId', type: String, required: true },
  { field: 'startTime', type: String, required: true },
  { field: 'endTime', type: String, required: true },
  { field: 'stage', type: String, required: true },
  { field: 'teams', required: true }
]

exports.Match = Match
