const botkit          = require("botkit")


const controller = botkit.slackbot({
    debug: true
})


exports.controller = controller


const bot = controller.spawn({
    token: process.env.slack_token
}).startRTM();

// bot.startRTM(function(err,bot,payload) {
//     if (err) {
//         throw new Error('Could not connect to Slack');
//     }
//
//     // close the RTM for the sake of it in 5 seconds
//     setTimeout(function() {
//         bot.closeRTM();
//     }, 5000);
// });

controller.on('tick', function(bot, event) {})


const wit = require('botkit-witai')({
    accessToken: process.env.accessToken,
    minConfidence: 0.6,
    logLevel: 'debug'
});


controller.middleware.receive.use(wit.receive);


require('../handlers/conversations')(controller)
require('../handlers/slack/conversations')(controller)
