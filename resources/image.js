const { FieldsModel } = require('@first-lego-league/synced-resources')

class Image extends FieldsModel {
  fields () {
    return Image.FIELDS
  }
}

Image.FIELDS = [
  { field: 'fielname', required: true },
  { field: 'source', type: String, required: true },
  { field: 'index', type: Number, defaultValue: -1, required: true }
]

exports.Image = Image
