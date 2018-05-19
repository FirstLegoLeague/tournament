'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger

const MONGU_URI = process.env.MONGO

exports.getRouter = function (collectionName) {
  const router = express.Router()

  router.get('/all', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(collectionName).find().toArray().then(data => {
        res.send(data)
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.get('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(collectionName).findOne({ 'number': parseInt(req.params.id) }).then(data => {
        if (!data) {
          res.sendStatus(404)
          return
        }

        res.send(data)
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.put('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(collectionName).findOneAndUpdate({ 'number': parseInt(req.params.id) }, req.body).then(dbResponse => {
        if (dbResponse.ok === 1) {
          res.sendStatus(200)
        }
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.post('/', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(collectionName).findOne({ 'number': parseInt(req.body.number) }).then(data => {
        if (data) {
          res.status(400)
          res.send('Team already exists')
          return
        }
        connection.db.collection('collectionName').insertOne(req.body).then(a => {
          if (a.insertedCount > 0) {
            res.sendStatus(200)
          }
        })
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.delete('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(collectionName).findOneAndDelete({ 'number': parseInt(req.params.id) }).then(dbResponse => {
        if (dbResponse.ok === 1) {
          res.sendStatus(200)
        }
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  return router
}
