'use strict'
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const MONGU_URI = process.env.MONGO;
const DB_NAME = 'test';


router.get('/', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('teams').find().toArray().then((data) => {
            res.send(data);
        });
    }).catch((err) => {
        //TODO: use ms-logger
        console.log(err);
        res.sendStatus(500);
    });
});

router.get('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('teams').findOne({'number': parseInt(req.params.id)}).then((data) => {
            if (!data) {
                res.sendStatus(404);
                return;
            }

            res.send(data);
        });
    }).catch((err) => {
        //TODO: use ms-logger
        console.log(err);
        res.sendStatus(500);
        return;
    });
});

router.put('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('teams').findOneAndUpdate({'number': parseInt(req.params.id)}, req.body).then((a) => {
            if (a.ok === 1) {
                res.sendStatus(200);
                return;
            }
        });
    }).catch((err) => {
        //TODO: use ms-logger
        console.log(err);
        res.sendStatus(500);
        return;
    });
});

router.post('/', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('teams').findOne({'number': parseInt(req.body.number)}).then((data) => {
            if (data) {
                res.status(400);
                res.send("Team allready exists");
                return;
            }
            connection.db(DB_NAME).collection('teams').insertOne(req.body).then((a) => {
                if (a.insertedCount > 0) {
                    res.sendStatus(200);
                    return;
                }
            });
        });
    }).catch((err) => {
        //TODO: use ms-logger
        console.log(err);
        res.sendStatus(500);
        return;
    });
});

router.delete('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('teams').findOneAndDelete({'number': parseInt(req.params.id)}).then((a) => {
            if (a.ok === 1) {
                res.sendStatus(200);
                return;
            }
        });
    }).catch((err) => {
        //TODO: use ms-logger
        console.log(err);
        res.sendStatus(500);
        return;
    });
});


module.exports = router;