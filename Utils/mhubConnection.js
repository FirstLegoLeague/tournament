const domain = require('domain')
const { MClient } = require('mhub')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { getCorrelationId, correlateSession } = require('@first-lego-league/ms-correlation')

const MHUB_NODES = {
  PUBLIC: 'public',
  PROTECTED: 'protected'
}

const MHUB_CLIENT_ID = 'cl-schedule'

const mhubClient = new MClient(process.env.MHUB)
mhubClient.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD)

mhubClient.on('error', msg => {
  domain.create().run(() => {
    correlateSession()
    MsLogger.error('Unable to connect to mhub, other modules won\'t be notified changes \n ' + msg)
  })
})

function publishUpdateMsg (nameSpace) {
  mhubClient.connect().then(() => {
    mhubClient.publish(MHUB_NODES.PROTECTED, `${nameSpace}:reload`, '', {
      'client-id': MHUB_CLIENT_ID,
      'correlation-id': getCorrelationId()
    })
  })
}

exports = {
  publishUpdateMsg: publishUpdateMsg,
  MHUB_NODES
}
