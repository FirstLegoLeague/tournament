const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const version = require('project-version')
const { correlationMiddleware } = require('@first-lego-league/ms-correlation')
const { authenticationMiddleware, authenticationDevMiddleware, authroizationMiddlware } = require('@first-lego-league/ms-auth')
const { loggerMiddleware, Logger } = require('@first-lego-league/ms-logger')
const { MongoCollectionServer, MongoEntityServer } = require('@first-lego-league/synced-resources')

const { configRouter } = require('./server/routers/config')
const { scheduleRouter } = require('./server/routers/schedule')

const { Team } = require('./resources/team')
const { Table } = require('./resources/table')
const { Match } = require('./resources/match')
const { Image } = require('./resources/image')
const { Status } = require('./resources/status')
const { Settings } = require('./resources/settings')

const DEFAULT_PORT = 3001

const logger = new Logger()
logger.info(`-------------------- Tournament version ${version} startup --------------------`)

const port = process.env.PORT || DEFAULT_PORT

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(correlationMiddleware)
app.use(loggerMiddleware)
app.use(cors())

const authMiddleware = process.env.NODE_ENV === 'development' ? authenticationDevMiddleware() : authenticationMiddleware
const adminAction = authroizationMiddlware(['admin', 'development'])

app.post(authMiddleware, adminAction)
app.put(authMiddleware, adminAction)
app.delete(authMiddleware, adminAction)

app.use('/teams', new MongoCollectionServer(Team))
app.use('/table', new MongoCollectionServer(Table))
app.use('/match', new MongoCollectionServer(Match))
app.use('/image', new MongoCollectionServer(Image))
app.use('/status', new MongoEntityServer(Status, { initialValue: Status.initialValue }))
app.use('/settings', new MongoEntityServer(Settings, { initialValue: Settings.initialValue }))

app.use('/config', configRouter)
app.use(scheduleRouter)

app.use(authMiddleware, adminAction)

app.use(express.static(path.join(__dirname, 'dist', 'client')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'client', 'index.html'))
})

app.listen(port, () => {
  logger.info(`tournament service listening on port ${port}`)
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
