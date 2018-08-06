'use strict'

const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const {correlationMiddleware} = require('@first-lego-league/ms-correlation')
const {authenticationMiddleware, authenticationDevMiddleware} = require('@first-lego-league/ms-auth')
const {loggerMiddleware, Logger} = require('@first-lego-league/ms-logger')

const logger = Logger()
const crudRouter = require('./routers/crudRouter').getRouter

const Team = require('./models/Team')
const Match = require('./models/Match')
const Table = require('./models/Table')

const appPort = process.env.PORT || 3001

logger.setLogLevel(process.env.LOG_LEVEL || logger.LOG_LEVELS.DEBUG)

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(correlationMiddleware)
app.use(loggerMiddleware)
app.use(cors())

const {getSettingsRouter, setDefaultSettings} = require('./routers/generalSettingsRouter')
const tournamentDataRouter = require('./routers/tournamentDataRouter')
const matchTeamRouter = require('./routers/matchTeamRouter')
const teamsBatchUploadRouter = require('./routers/teamsBatchUploadRouter')
const tournamentStatusRouter = require('./routers/tournamentStatusRouter')

setDefaultSettings()

app.use('/settings', getSettingsRouter())

if (process.env.DEV) {
  app.post(authenticationDevMiddleware())
  app.put(authenticationDevMiddleware())
  app.delete(authenticationDevMiddleware())
} else {
  app.post(authenticationMiddleware)
  app.put(authenticationMiddleware)
  app.delete(authenticationMiddleware)
}

app.use('/tournamentData', tournamentDataRouter)

const teamLogic = require('./logic/teamLogic')

app.use('/team', crudRouter({
  'collectionName': 'teams',
  'IdField': Team.IdField,
  'mhubNamespace': 'teams',
  'extraRouters': [teamsBatchUploadRouter.getRouter(), matchTeamRouter.getRouter(), tournamentStatusRouter.getRouter()],
  'validationMethods': {
    'delete': teamLogic.deleteValidation
  }
}))

app.use('/match', crudRouter({
  'collectionName': 'matches',
  'IdField': Match.IdField,
  'mhubNamespace': 'matches'
}))

app.use('/table', crudRouter({
  'collectionName': 'tables',
  'IdField': Table.IdField,
  'mhubNamespace': 'tables'
}))

app.use(express.static(path.join(__dirname, 'dist/client')))
// Design files
app.use('/design', express.static(path.resolve(__dirname, 'node_modules/@first-lego-league/user-interface/current/assets')))
app.use('/webfonts', express.static(path.resolve(__dirname, 'node_modules/@first-lego-league/user-interface/current/assets/fonts')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'))
})

app.listen(appPort, () => {
  logger.info('Server started on port ' + appPort)
})

process.on('SIGINT', () => {
  logger.info('Process received SIGINT: shutting down')
  process.exit(130)
})

process.on('uncaughtException', err => {
  logger.fatal(err.message)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  logger.fatal(err.message)
  process.exit(1)
})
