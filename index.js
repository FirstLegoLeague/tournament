'use strict'
const express = require('express')
const msLogger = require('@first-lego-league/ms-logger').Logger()
const msCorrelation = require('@first-lego-league/ms-correlation')
const crudRouter = require('./routers/crudRouter').getRouter

const appPort = process.env.PORT || 3001
const bodyParser = require('body-parser')

msLogger.setLogLevel(process.env.LOG_LEVEL || msLogger.LOG_LEVELS.DEBUG)

const app = express()
app.use(bodyParser.json())
app.use(msCorrelation.correlationMiddleware)
const tournamentDataRouter = require('./routers/tournamentDataRouter')

app.use('/tournamentData', tournamentDataRouter)
app.use('/team', crudRouter('teams'))
app.use('/match/practice', crudRouter('practice-matches'))
app.use('/match/ranking', crudRouter('ranking-matches'))
app.use('/table', crudRouter('tables'))

app.listen(appPort, () => {
  msLogger.info('Server started on port ' + appPort)
})
