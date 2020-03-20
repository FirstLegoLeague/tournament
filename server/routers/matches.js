const { MongoCollectionServer, MongoResourceAdapter } = require('@first-lego-league/synced-resources')

const { Match } = require('../../resources/match')
const { Settings } = require('../../resources/settings')

const settingsAdapter = new MongoResourceAdapter(Settings)

const router = new MongoCollectionServer(Match, {
  beforeSend: match => {
    return settingsAdapter.all(([settings]) => {
      match.offsetTimes(settings.scheduleTimeOffset)
      return match
    })
  }
})

exports.matchesRouter = router
