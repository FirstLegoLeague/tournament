'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGO_URI = process.env.MONGO_URI

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
    connection().then(conn => {
      conn.close()
    })
  }
}

module.exports = {
  connect,
  connection,
  close
}
