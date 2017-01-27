const botkit          = require("botkit")
const graph           = require("fbgraph")


graph.setAccessToken(process.env.fb_access_token);


const controller = botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    require_delivery: true,
    validate_request: true
})

const wit = require('botkit-witai')({
    accessToken: process.env.accessToken,
    minConfidence: 0.6,
    logLevel: 'debug'
});


exports.controller = controller


const bot = controller.spawn({})


controller.on('tick', function(bot, event) {})


controller.middleware.receive.use(wit.receive);


controller.setupWebserver(process.env.port || 3000,function(err,webserver){controller.createWebhookEndpoints(webserver,bot,function(){})})


require('../handlers/conversations')(controller)
require('../handlers/facebook/conversations')(controller)
