'use strict'
const { MClient } = require('mhub')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { getCorrelationId } = require('@first-lego-league/ms-correlation')

const MHUB_NODES = {
  PUBLIC: 'public',
  PROTECTED: 'protected'
}

const MHUB_CLIENT_ID = 'cl-tournament'
const mhubClient = new MClient(process.env.MHUB_URI)

const listeners = []
let connectionPromise = null

mhubClient.on('error', msg => {
  MsLogger.error('Unable to connect to mhub, other modules won\'t be notified changes \n ' + msg)
})

mhubClient.on('close', () => {
  connectionPromise = null
  MsLogger.warn('Disconnected from mhub. Retrying upon next publish')
})

mhubClient.on('open', () => {
  mhubClient.subscribe(loginToMhub(MHUB_NODES.PROTECTED))
})

mhubClient.on('message', msg => {
  console.log(msg)
  const data = msg.data ? JSON.parse(msg.data) : undefined
  const headers = msg.headers
  const topic = msg.topic

  msg.from = headers[MHUB_CLIENT_ID]
  msg.fromMe = (msg.from === this.token)

  listeners.filter(listener => {
    return (typeof (listener.topic) === 'string' && topic === listener.topic) ||
      (listener.topic instanceof RegExp && topic.matches(listener.topic))
  }).forEach(listener => listener.handler(data, msg))
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

function subscribe (topic, handler) {
  listeners.push({ topic, handler })
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
