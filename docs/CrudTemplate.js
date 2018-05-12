'use strict'
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const MONGU_URI = process.env.MONGO;
const DB_NAME = '';


router.get('/', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('')
    }).catch((err) => {

    });
});

router.get('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('')
    }).catch((err) => {

    });
});

router.put('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('')
    }).catch((err) => {

    });
});

router.post('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('')
    }).catch((err) => {

    });
});

router.delete('/:id', (req, res) => {
    MongoClient.connect(MONGU_URI).then((connection) => {
        connection.db(DB_NAME).collection('')
    }).catch((err) => {

    });
});


module.exports = router;