class Table {
  constructor (tableId, tableName) {
    this.tableId = tableId
    this.tableName = tableName
  }
}
Table.IdField = '_id'
module.exports = Table
