const { Model } = require('@first-lego-league/synced-resources')

class Settings extends Model { }

Settings.initialValue = {
  tournamentTitle: ''
}

exports.Settings = Settings
