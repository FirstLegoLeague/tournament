const { FieldsModel } = require('@first-lego-league/synced-resources')

class Table extends FieldsModel {
  fields () {
    return Table.FIELDS
  }
}

Table.FIELDS = [
  { field: 'name', type: String, required: true }
]

exports.Table = Table
