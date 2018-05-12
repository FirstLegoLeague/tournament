'use strict'
const express = require('express');
const bodyParser =require('body-parser')
const app = express();
app.use(bodyParser.json());

const appPort = process.env.PORT || 3001;

let tournamentDataController = require('./controllers/tournamentDataController');
app.use('/tournamentData', tournamentDataController);


app.listen(appPort, ()=>{
    //TODO: use logger to write to log
    console.log("Started app on port: "+appPort)
    console.log(process.env.MONGO)
});