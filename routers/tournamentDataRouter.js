'use strict'
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const tournamentDataParser = require('../logic/tournamentDataParser');

const DATABASE_NAME = 'test';

router.post('/', (req, res) => {
    if (!req.body.tourData) {
        res.status(400);
        res.send('Please provide data..');
    }

    let data = tournamentDataParser.parse(req.body.tourData, ',');
    MongoClient.connect(process.env.MONGO).then((conn) => {

        conn.db(DATABASE_NAME).collection('tables').insertMany(data.tables).then(() => {
            //TODO: use ms-logger
            console.log("all good")
        }).catch((err) => {
            //TODO: use ms-logger
            console.log(err)
        });

        conn.db(DATABASE_NAME).collection('teams').insertMany(data.teams).then(() => {
             //TODO: use ms-logger
            console.log("all good")
        }).catch((err) => {
            //TODO: use ms-logger
            console.log(err)
        });

        conn.db(DATABASE_NAME).collection('practice-matches').insertMany(data.practiceMatches).then(() => {
            //TODO: use ms-logger
            console.log("all good")
        }).catch((err) => {
            //TODO: use ms-logger
            console.log(err)
        });

        conn.db(DATABASE_NAME).collection('ranking-matches').insertMany(data.rankingMatches).then(() => {
            //TODO: use ms-logger
            console.log("all good")
        }).catch((err) => {
            //TODO: use ms-logger
            console.log(err)
        });


        res.status(201);
        return;
    }).catch((err) => {
        console.log(err);
        res.status(500);
        return;
    });

    res.send();
});


module.exports = router;