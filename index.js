'use strict'

const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const {correlationMiddleware} = require('@first-lego-league/ms-correlation')
const {authenticationMiddleware, authenticationDevMiddleware} = require('@first-lego-league/ms-auth')
const {loggerMiddleware, Logger} = require('@first-lego-league/ms-logger')

const Team = require('./server/models/Team')
const Match = require('./server/models/Match')
const Table = require('./server/models/Table')

const logger = Logger()
const db = require('./server/Utils/mongoConnection')

const appPort = process.env.PORT || 3001
const authenticationMiddlewareToUse = process.env.DEV ? authenticationDevMiddleware() : authenticationMiddleware

logger.setLogLevel(process.env.LOG_LEVEL || logger.LOG_LEVELS.DEBUG)

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(correlationMiddleware)
app.use(loggerMiddleware)
app.use(cors())

const {getSettingsRouter} = require('./server/routers/generalSettingsRouter')
const configRouter = require('./server/routers/configRouter')
const crudRouter = require('./server/routers/crudRouter').getRouter
const tournamentDataRouter = require('./server/routers/tournamentDataRouter')
const matchTeamRouter = require('./server/routers/matchTeamRouter')
const teamsBatchUploadRouter = require('./server/routers/teamsBatchUploadRouter')
const tournamentStatusRouter = require('./server/routers/tournamentStatusRouter')
const {imagesRouter} = require('./server/routers/imagesRouter')

app.post(authenticationMiddlewareToUse)
app.put(authenticationMiddlewareToUse)
app.delete(authenticationMiddlewareToUse)

app.use('/settings', getSettingsRouter())
app.use('/image', imagesRouter)
app.all('/config', configRouter)

app.use('/tournamentData', tournamentDataRouter)

const teamLogic = require('./server/logic/teamLogic')

app.use('/team', crudRouter({
  'collectionName': 'teams',
  'IdField': Team.IdField,
  'mhubNamespace': 'teams',
  'extraRouters': [teamsBatchUploadRouter.getRouter(), matchTeamRouter.getRouter()],
  'validationMethods': {
    'delete': teamLogic.deleteValidation,
    'post': teamLogic.createValidation,
    'put': teamLogic.deleteValidation
  }
}))

app.use('/match', crudRouter({
  'collectionName': 'matches',
  'IdField': Match.IdField,
  'extraRouters': [tournamentStatusRouter.getRouter()],
  'mhubNamespace': 'matches'
}))

app.use('/table', crudRouter({
  'collectionName': 'tables',
  'IdField': Table.IdField,
  'mhubNamespace': 'tables'
}))

app.use(authenticationMiddlewareToUse)

app.use(express.static(path.join(__dirname, 'dist/client')))
// Design files
app.use('/design', express.static(path.resolve(__dirname, 'node_modules/@first-lego-league/user-interface/current/assets')))
app.use('/webfonts', express.static(path.resolve(__dirname, 'node_modules/@first-lego-league/user-interface/current/assets/fonts')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'))
})

db.connect().then(() => {
  app.listen(appPort, () => {
    logger.info('Server started on port ' + appPort)
  })
})

process.on('SIGINT', () => {
  logger.info('Process received SIGINT: shutting down')
  db.close()
  process.exit(130)
})

process.on('uncaughtException', err => {
  logger.fatal(err.message)
  console.error(err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  logger.fatal(err.message)
  console.error(err)
  process.exit(1)
})
