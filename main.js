/**
 * Created by charlesanthonybrowne on 19/01/2017.
 */


const dotenv          = require('dotenv').config()


// Do our checks to make sure we have all the required tokens etc.
if (!process.env.page_token) {
    console.log('Error: Specify page_token in environment')
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log('Error: Specify verify_token in environment')
    process.exit(1);
}

if (!process.env.app_secret) {
    console.log('Error: Specify app_secret in environment')
    process.exit(1);
}

if (!process.env.serviceUri) {
    console.log('Error: Specify wit in environment')
    process.exit(1);
}


const botkit          = require("botkit")
const os              = require("os")
const bodyParser      = require('body-parser')
const crypto          = require('crypto')
const fetch           = require('node-fetch')
const rp              = require('request-promise')


// Require our botkit controllers
require('./app/controllers/facebook')
require('./app/controllers/slack')