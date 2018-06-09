'use strict'

const express = require('express')
const domain = require('domain')
const {correlateSession} = require('@first-lego-league/ms-correlation')
const msLogger = require('@first-lego-league/ms-logger').Logger()
const msCorrelation = require('@first-lego-league/ms-correlation')

const crudRouter = require('./routers/crudRouter').getRouter

const Team = require('./models/Team')
const Match = require('./models/Match')
const Table = require('./models/Table')

const appPort = process.env.PORT || 3001

const bodyParser = require('body-parser')

msLogger.setLogLevel(process.env.LOG_LEVEL || msLogger.LOG_LEVELS.DEBUG)

const app = express()
app.use(bodyParser.json())
app.use(msCorrelation.correlationMiddleware)
const tournamentDataRouter = require('./routers/tournamentDataRouter')

app.use('/tournamentData', tournamentDataRouter)

app.use('/team', crudRouter({
  'collectionName': 'teams',
  'IdField': Team.IdField
}))

app.use('/match/', crudRouter({
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
    msLogger.info('Server started on port ' + appPort)
  })
})
