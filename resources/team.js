const { FieldsModel, InvalidEntry } = require('@first-lego-league/synced-resources')

class Team extends FieldsModel {
  fields () {
    return Team.FIELDS
  }

  validate ({ collection }) {
    super.validate({ collection })
    if (collection.filter(team => team.number === this.number).length > 1) {
      throw new InvalidEntry('Duplicate team number')
    }
  }
}

Team.FIELDS = [
  { key: '_id', type: String, defaultValue: undefined },
  { key: 'number', type: Number, required: true },
  { key: 'name', type: String, required: true },
  { key: 'affiliation', type: String },
  { key: 'cityState', type: String },
  { key: 'country', type: String },
  { key: 'coach1', type: String },
  { key: 'coach2', type: String },
  { key: 'judgingGroup', type: String },
  { key: 'pitNumber', type: Number },
  { key: 'pitLocation', type: String },
  { key: 'language', type: String }
]

exports.Team = Team
