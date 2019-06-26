const Promise = require('bluebird')
const { MongoClient } = require('mongodb')
const { Logger } = require('@first-lego-league/ms-logger')

const MONGO_URI = process.env.MONGO_URI

const MsLogger = new Logger()

let _connection = null

function connect () {
  if (_connection == null) {
    MsLogger.info('Opening Mongo Db connection')
    _connection = MongoClient.connect(MONGO_URI, { useNewUrlParser: true, poolSize: 3 })
  }
  return _connection
}

function connection () {
  if (_connection == null) {
    MsLogger.debug('Mongo Db connection was not initialized, trying to connect before returning the connection')
    connect()
  }
  return _connection
}

function close () {
  MsLogger.info('Closing Mongo Db connection')
  if (_connection != null) {
    return connection()
      .then(conn => {
        conn.close()
      })
  }
  return Promise.resolve()
}

Object.assign(exports, {
  connect,
  connection,
  close
})
