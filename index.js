'use strict'
const express = require('express');
const msLogger = require('@first-lego-league/ms-logger')();
msLogger.setLogLevel(msLogger.LOG_LEVELS.DEBUG);
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const appPort = process.env.PORT || 3001;

let tournamentDataRouter = require('./routers/tournamentDataRouter');
app.use('/tournamentData', tournamentDataRouter);

let teamsRouter = require('./routers/teamsRouter');
app.use('/team', teamsRouter)

app.listen(appPort, () => {
    //TODO: Add real correlation id
    msLogger.info("corr-id","Server started on port " + appPort);
});