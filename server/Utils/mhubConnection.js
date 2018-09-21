'use strict'
const { MClient } = require('mhub')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { getCorrelationId } = require('@first-lego-league/ms-correlation')

const MHUB_NODES = {
  PUBLIC: 'public',
  PROTECTED: 'protected'
}

const MHUB_CLIENT_ID = 'cl-schedule'
const NODE = process.env.DEV ? 'default' : 'protected'
const mhubClient = new MClient(process.env.MHUB_URI)

let connectionPromise = null

connect().then(() => {
  mhubClient.subscribe(loginToMhub(MHUB_NODES.PROTECTED))
})

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
  }
  return connectionPromise
}

function publishUpdateMsg (nameSpace) {
  publishMsg(MHUB_NODES.PROTECTED, `${nameSpace}:reload`)
}

function publishMsg (node, topic, data = '') {
  const connectedNode = loginToMhub(node)
  MsLogger.debug(`Publishing message to mhub: ${connectedNode}, ${topic}, With data ${data}`)
  connect().then(() => {
    mhubClient.publish(connectedNode, topic, data, {
      'client-id': MHUB_CLIENT_ID,
      'correlation-id': getCorrelationId()
    })
  })
}

function subscribe (topic, handle) {
  mhubClient.subscribe(NODE, topic)
  mhubClient.on('message', message => {
    if (message.topic === topic) {
      handle(message)
    }
  })
}

function loginToMhub (node) {
  if (process.env.DEV) {
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
  subscribe,
  mhubClient,
  MHUB_NODES
}
