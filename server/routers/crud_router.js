'use strict'
const express = require('express')

const ObjectId = require('mongodb').ObjectID
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const db = require('../utilities/mongo_connection')

const mhubConnection = require('../utilities/mhub_connection')

const adminAction = authroizationMiddlware(['admin', 'development'])

exports.getRouter = function (options) {
  const router = express.Router()

  if (options.extraRouters) {
    for (const extraRouter of options.extraRouters) {
      router.use(extraRouter)
    }
  }

  router.get('/all', (req, res) => {
    db.connection().then(connection => {
      connection.db().collection(options.collectionName).find().toArray().then(data => {
        res.send(data)
      })
    }).catch(err => {
      MsLogger.error(err)
      res.sendStatus(500)
    })
  })

  router.get('/:id', (req, res) => {
    db.connection().then(connection => {
      connection.db().collection(options.collectionName).findOne(idMongoQuery(options.IdField, req.params.id)).then(data => {
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
    if (options.validationMethods && options.validationMethods.put) {
      validationResult = options.validationMethods.put(req.params)
    }

    if (!validationResult) {
      res.sendStatus(400)
    }

    if (typeof req.body._id === 'string') {
      delete req.body._id
    }

    db.connection().then(connection => {
      connection.db().collection(options.collectionName).findOneAndUpdate(idMongoQuery(options.IdField, req.params.id), { $set: req.body }).then(dbResponse => {
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
    if (options.validationMethods && options.validationMethods.post) {
      validationResult = options.validationMethods.post(req.params)
    }

    if (!validationResult) {
      res.sendStatus(400)
    }

    db.connection().then(connection => {
      connection.db().collection(options.collectionName).findOne(idMongoQuery(options.IdField, req.body[options.IdField])).then(data => {
        if (data) {
          res.status(400)
          res.send('Object already exists')
          return
        }

        if (typeof req.body._id === 'string') {
          delete req.body._id
        }

        connection.db().collection(options.collectionName).insertOne(req.body).then(a => {
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
    let validationResult = Promise.resolve(true)
    if (options.validationMethods && options.validationMethods.delete) {
      validationResult = options.validationMethods.delete(req.params)
    }

    if (!validationResult) {
      res.sendStatus(400)
    }
    validationResult.then(error => {
      if (error && error.name === 'Error') {
        res.status(500).send(error.message)
        return
      }
      db.connection().then(connection => {
        connection.db().collection(options.collectionName).findOneAndDelete(idMongoQuery(options.IdField, req.params.id)).then(dbResponse => {
          if (dbResponse.ok === 1) {
            mhubConnection.publishUpdateMsg(options.mhubNamespace)
            res.sendStatus(200)
          }
        })
      }).catch(err => {
        MsLogger.error(err)
        res.sendStatus(500)
      })
    }).catch(err => {
      MsLogger.error(err)
    })
  })

  return router
}

function idMongoQuery (idField, id) {
  const query = {}
  if (idField == '_id') {
    id = ObjectId(id)
  }
  query[idField] = id
  return query
}
