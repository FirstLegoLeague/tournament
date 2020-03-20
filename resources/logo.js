const { FieldsModel } = require('@first-lego-league/synced-resources')

class Logo extends FieldsModel {
  fields () {
    return Logo.FIELDS
  }
}

Logo.FIELDS = [
  { key: '_id', type: String, defaultValue: undefined },
  { key: 'filename', required: true },
  { key: 'source', type: String, required: true }
]

exports.Logo = Logo
