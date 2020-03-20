const { MongoResourceAdapter } = require('@first-lego-league/synced-resources')

const { Settings } = require('../../resources/settings')

class SettingsProvider {
  constructor () {
    this._adapter = new MongoResourceAdapter(Settings)
  }

  get (setting) {
    return this._adapter.all()
      .then(([settings]) => settings[setting])
  }
}

exports.settingsProvider = new SettingsProvider()
