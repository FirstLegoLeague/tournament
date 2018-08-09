'use strict'
const domain = require('domain')
const {MClient} = require('mhub')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const {getCorrelationId, correlateSession} = require('@first-lego-league/ms-correlation')

const MHUB_NODES = {
  PUBLIC: 'public',
  PROTECTED: 'protected'
}

const MHUB_CLIENT_ID = 'cl-schedule'

const mhubClient = new MClient(process.env.MHUB_URI)

mhubClient.on('error', msg => {
  MsLogger.error('Unable to connect to mhub, other modules won\'t be notified changes \n ' + msg)
})

function publishUpdateMsg (nameSpace) {
  let connectedNode = loginToMhub(MHUB_NODES.PROTECTED)


  mhubClient.connect().then(() => {
    mhubClient.publish(connectedNode, `${nameSpace}:reload`, '', {
      'client-id': MHUB_CLIENT_ID,
      'correlation-id': getCorrelationId()
    })
  })
}

function publishMsg (node, topic, data = '') {
  let connectedNode = loginToMhub(node)

  mhubClient.connect().then(() => {
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

  if (node == MHUB_NODES.PROTECTED) {
    mhubClient.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD)
    return MHUB_NODES.PROTECTED
  }
}

module.exports = {
  publishUpdateMsg,
  publishMsg,
  MHUB_NODES
}
