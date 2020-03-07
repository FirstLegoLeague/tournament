const { FieldsModel, InvalidEntry } = require('@first-lego-league/synced-resources')

class Team extends FieldsModel {
  fields () {
    return Team.FIELDS
  }

  validate ({ collection }) {
    if (collection.filter(team => team.number === this.number).length !== 1) {
      throw new InvalidEntry('Duplicate team number')
    }
  }
}

Team.FIELDS = [
  { field: 'number', type: Number, required: true },
  { field: 'name', type: String, required: true },
  { field: 'affiliation', type: String },
  { field: 'cityState', type: String },
  { field: 'country', type: String },
  { field: 'coach1', type: String },
  { field: 'coach2', type: String },
  { field: 'judgingGroup', type: String },
  { field: 'pitNumber', type: Number },
  { field: 'pitLocation', type: String },
  { field: 'language', type: String }
]

exports.Team = Team
