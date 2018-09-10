'use strict'
const { MClient } = require('mhub')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { getCorrelationId } = require('@first-lego-league/ms-correlation')

const MHUB_NODES = {
  PUBLIC: 'public',
  PROTECTED: 'protected'
}

const MHUB_CLIENT_ID = 'cl-schedule'

const mhubClient = new MClient(process.env.MHUB_URI)

let connectionPromise = null

mhubClient.on('error', msg => {
  MsLogger.error('Unable to connect to mhub, other modules won\'t be notified changes \n ' + msg)
})

mhubClient.on('close', () => {
  connectionPromise = null
  MsLogger.warn('Disconnected from mhub. Retrying upon next publish')
})

function connect () {
  if (!connectionPromise) {
    connectionPromise = mhubClient.connect()
    if (!process.env.DEV) {
      connectionPromise = connectionPromise
        .then(() => mhubClient.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD))
    }
  }
  return connectionPromise
}

function publishUpdateMsg (nameSpace) {
  const connectedNode = loginToMhub(MHUB_NODES.PROTECTED)

  publishMsg(connectedNode, `${nameSpace}:reload`)
}

function publishMsg (node, topic, data = '') {
  const connectedNode = loginToMhub(node)

  connect().then(() => {
    MsLogger.debug(`Publishing message to mhub: ${connectedNode}, ${topic}, With data ${data}`)
    mhubClient.publish(connectedNode, topic, data, {
      'client-id': MHUB_CLIENT_ID,
      'correlation-id': getCorrelationId()
    })
  })
}

function loginToMhub (node) {
  if (process.env.DEV) {
    mhubClient.login('default', '')
    return 'default'
  }

  if (node === MHUB_NODES.PROTECTED) {
    mhubClient.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD)
    return MHUB_NODES.PROTECTED
  }
}

module.exports = {
  publishUpdateMsg,
  publishMsg,
  MHUB_NODES
}
