const { MongoResourceAdapter } = require('@first-lego-league/synced-resources')
const { createMessenger } = require('@first-lego-league/ms-messenger')
const { Logger } = require('@first-lego-league/ms-logger')

const { Status } = require('../../resources/status')
const { Match } = require('../../resources/match')

const statusAdapter = new MongoResourceAdapter(Status)
const matchesAdapter = new MongoResourceAdapter(Match)
const logger = new Logger()

const getNextMatchId = () => {
  return statusAdapter.all().then(([{ nextMatchId }]) => nextMatchId)
}

const getNextMatch = () => {
  return getNextMatchId()
    .then(nextMatchId => matchesAdapter.get(nextMatchId))
}

const getNextMatches = (limit, filters = []) => {
  return getNextMatch()
    .then(nextMatch => {
      return matchesAdapter.search({
        $and: filters.concat([{ 'startTime': { $gt: new Date(nextMatch.startTime) } }, { 'stage': nextMatch.stage }])
      }, { limit }).then(nextMatches => [nextMatch].concat(nextMatches))
    })
}

const setNextMatchId = nextMatchId => {
  return statusAdapter.all()
    .then(([{ _id }]) => statusAdapter.update(_id, { nextMatchId }))
}

const init = () => {
  let lastMatchFinished = true

  const messenger = createMessenger({
    clientId: 'tournament-status',
    node: 'protected',
    credentials: {
      username: 'protected-client',
      password: process.env.PROTECTED_MHUB_PASSWORD
    }
  })

  messenger.on('clock:start', () => {
    logger.info('Got clock start event')
    if (lastMatchFinished) {
      lastMatchFinished = false
      return getNextMatches(2)
        .then(nextMatches => {
          if (nextMatches[1]) {
            return setNextMatchId(nextMatches[1]._id)
          }
        })
        .catch(e => logger.warn(`Error when trying to set the next match number: ${e.message}`))
    }
  })

  messenger.on('clock:end', () => {
    logger.info('Got clock end event')
    lastMatchFinished = true
  })
}

Object.assign(exports, {
  init,
  getNextMatchId,
  getNextMatch,
  setNextMatchId,
  getNextMatches
})
