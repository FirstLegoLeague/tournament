'use strict'
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());

const appPort = process.env.PORT || 3001;

let tournamentDataController = require('./routers/tournamentDataRouter');
app.use('/tournamentData', tournamentDataController);

let teamsController = require('./routers/teamsRouter');
app.use('/teams', teamsController);

app.listen(appPort, () => {
    //TODO: use logger to write to log
    console.log("Started app on port: " + appPort)
    console.log(process.env.MONGO)
});