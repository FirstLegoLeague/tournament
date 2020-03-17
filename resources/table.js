const { FieldsModel } = require('@first-lego-league/synced-resources')

class Table extends FieldsModel {
  fields () {
    return Table.FIELDS
  }
}

Table.FIELDS = [
  { field: 'name', type: String, required: true }
]

Table.developmentCollection = () => {
  return [
    { name: 'table1' },
    { name: 'table2' },
    { name: 'table3' },
    { name: 'table4' }
  ]
    .map(attrs => new Table(attrs))
}

exports.Table = Table
