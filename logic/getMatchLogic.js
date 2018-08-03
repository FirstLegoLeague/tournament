'use strict'
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()

const MONGU_URI = process.env.MONGO_URI

let match = 0

function getCurrentMatch () {
    MongoClient.connect(MONGU_URI).then(connection => {
        connection.db().collection('matches').findOne()
    })
}
