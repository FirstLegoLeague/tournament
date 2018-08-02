'use strict'
const express = require('express')

const MongoClient = require('mongodb').MongoClient
const MsLogger = require('@first-lego-league/ms-logger').Logger()
const { authroizationMiddlware } = require('@first-lego-league/ms-auth')

const MONGU_URI = process.env.MONGO_URI

exports.getRouter = function () {
    const router = express.Router()
}