'use strict'
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const adminAction = authroizationMiddlware(['admin', 'scorekeeper', 'development'])

const MONGU_URI = process.env.MONGO

exports.getRouter = function (Model) {
  const router = express.Router()

  router.get('/all', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(Model.collectionName).find().toArray().then(data => {
        res.send(data)
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.get('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(Model.collectionName).findOne(idMongoQuery(Model.IdField, parseInt(req.params.id))).then(data => {
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
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(Model.collectionName).findOneAndUpdate(idMongoQuery(Model.IdField, parseInt(req.params.id)), req.body).then(dbResponse => {
        if (dbResponse.ok === 1) {
          res.sendStatus(200)
        }
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.post('/', adminAction, (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(Model.collectionName).findOne(idMongoQuery(Model.IdField, req.body[Model.IdField])).then(data => {
        if (data) {
          res.status(400)
          res.send('Object already exists')
          return
        }
        connection.db.collection(Model.collectionName).insertOne(req.body).then(a => {
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

  router.delete('/:id', adminAction, (req, res) => {
    MongoClient.connect(MONGU_URI).then(connection => {
      connection.db().collection(Model.collectionName).findOneAndDelete(idMongoQuery(Model.IdField, parseInt(req.params.id))).then(dbResponse => {
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

function idMongoQuery (idField, id) {
  const query = {}
  query[idField] = id
  return query
}
