const botkit          = require("botkit")


const controller = botkit.slackbot({
    debug: true
})


exports.controller = controller


const bot = controller.spawn({
    token: process.env.slack_token
}).startRTM();


controller.on('tick', function(bot, event) {})


const wit = require('botkit-witai')({
    accessToken: process.env.accessToken,
    minConfidence: 0.6,
    logLevel: 'debug'
});


controller.middleware.receive.use(wit.receive);


require('../handlers/conversations')(controller)
