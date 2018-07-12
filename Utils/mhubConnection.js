const domain = require('domain')
const {MClient} = require('mhub')
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const {getCorrelationId, correlateSession} = require('@first-lego-league/ms-correlation')

const MHUB_NODES = {
  PUBLIC: 'public'
}

const MHUB_CLIENT_ID = 'cl-schedule'

const mhubClient = new MClient(process.env.MHUB)
mhubClient.on('error', msg => {
  domain.create().run(() => {
    correlateSession()
    MsLogger.error('Unable to connect to mhub, other modules won\'t be notified changes \n ' + msg)
  })
})

function publish(node, topic, msg) {
  mhubClient.connect().then(() => {
    mhubClient.publish(node, topic, msg, {
      'client-id': MHUB_CLIENT_ID,
      'correlation-id': getCorrelationId()
    })
  })
}

exports = {
  publish,
  MHUB_NODES
}
