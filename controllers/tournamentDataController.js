'use strict'
const express = require('express');
const fs = require('fs');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const tournamentDataParser = require('../logic/parseTournamentFile');

const DATABASE_NAME = 'test';

router.post('/', (req, res) => {
    if (!req.body.tourData) {
        res.status(500);
    }

    let rawData = fs.readFileSync('./docs/test-file_converted.csv', 'utf-8');
    let data = tournamentDataParser.parse(rawData, ',');
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


        res.status(200);
        return;
    }).catch((err) => {
        console.log(err);
        res.status(500);
        return;
    });

    res.send();
});


module.exports = router;