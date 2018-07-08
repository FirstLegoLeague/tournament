'use strict'

const express = require('express')
const domain = require('domain')
const { correlateSession, correlationMiddleware } = require('@first-lego-league/ms-correlation')
const { authenticationMiddleware, authenticationDevMiddleware } = require('@first-lego-league/ms-auth')
const {loggerMiddleware, Logger} = require('@first-lego-league/ms-logger')

const logger = Logger()
const crudRouter = require('./routers/crudRouter').getRouter

const Team = require('./models/Team')
const Match = require('./models/Match')
const Table = require('./models/Table')

const appPort = process.env.PORT || 3001

const bodyParser = require('body-parser')

logger.setLogLevel(process.env.LOG_LEVEL || logger.LOG_LEVELS.DEBUG)

const app = express()
app.use(bodyParser.json())
app.use(correlationMiddleware)
app.use(loggerMiddleware)

if (process.env.DEV) {
  app.use(authenticationDevMiddleware())
} else {
  app.use(authenticationMiddleware)
}

app.use(msCorrelation.correlationMiddleware)
app.use(cors())

const tournamentDataRouter = require('./routers/tournamentDataRouter')
const matchTeamRouter = require('./routers/matchTeamRouter')

app.use('/tournamentData', tournamentDataRouter)

app.use('/team', crudRouter({
  'collectionName': 'teams',
  'IdField': Team.IdField
}))

app.use('/team', matchTeamRouter.getRouter())

app.use('/match', crudRouter({
  'collectionName': 'matches',
  'IdField': Match.IdField
}))

app.use('/table', crudRouter({
  'collectionName': 'tables',
  'IdField': Table.IdField
}))

app.listen(appPort, () => {
  domain.create().run(() => {
    correlateSession()
    logger.info('Server started on port ' + appPort)
  })
})
