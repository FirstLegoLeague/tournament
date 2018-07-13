'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')
const mhubConnection = require('../Utils/mhubConnection')
const adminAction = authroizationMiddlware(['admin', 'development'])

const MONGU_URI = process.env.MONGO

exports.getRouter = function (options) {
  const router = express.Router()

  router.get('/all', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(options.collectionName).find().toArray().then(data => {
        res.send(data)
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.get('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(options.collectionName).findOne(idMongoQuery(options.IdField, parseInt(req.params.id))).then(data => {
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

  router.put('/:id', adminAction, (req, res) => {
    let validationResult = true
    if (options.validationMethods.put) {
      validationResult = options.validationMethods.put(req.params)
    }

    if (!validationResult) {
      res.sendStatus(400)
    }

    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(options.collectionName).findOneAndUpdate(idMongoQuery(options.IdField, parseInt(req.params.id)), req.body).then(dbResponse => {
        if (dbResponse.ok === 1) {
          mhubConnection.publishUpdateMsg(options.mhubNamespace)
          res.sendStatus(204)
        }
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.post('/', adminAction, (req, res) => {
    let validationResult = true
    if (options.validationMethods.post) {
      validationResult = options.validationMethods.post(req.params)
    }

    if (!validationResult) {
      res.sendStatus(400)
    }
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(options.collectionName).findOne(idMongoQuery(options.IdField, req.body[options.IdField])).then(data => {
        if (data) {
          res.status(400)
          res.send('Object already exists')
          return
        }
        connection.db.collection(options.collectionName).insertOne(req.body).then(a => {
          if (a.insertedCount > 0) {
            mhubConnection.publishUpdateMsg(options.mhubNamespace)
            res.sendStatus(201)
          }
        })
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.delete('/:id', adminAction, (req, res) => {
    let validationResult = true
    if (options.validationMethods.delete) {
      validationResult = options.validationMethods.delete(req.params)
    }

    if (!validationResult) {
      res.sendStatus(400)
    }
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(options.collectionName).findOneAndDelete(idMongoQuery(options.IdField, parseInt(req.params.id))).then(dbResponse => {
        if (dbResponse.ok === 1) {
          mhubConnection.publishUpdateMsg(options.mhubNamespace)
          res.sendStatus(200)
        }
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  if (options.extraRouters) {
    for (const extraRouter of options.extraRouters) {
      router.use(extraRouter)
    }
  }

  return router
}

function idMongoQuery (idField, id) {
  const query = {}
  query[idField] = id
  return query
}
