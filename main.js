/**
 * Created by charlesanthonybrowne on 19/01/2017.
 */


if (!process.env.page_token) {
    console.log('Error: Specify page_token in environment');
    process.exit(1);
}
if (!process.env.verify_token) {
    console.log('Error: Specify verify_token in environment');
    process.exit(1);
}
if (!process.env.app_secret) {
    console.log('Error: Specify app_secret in environment');
    process.exit(1);
}
if (!process.env.serviceUri) {
    console.log('Error: Specify wit in environment');
    process.exit(1);
}

const botkit          = require("botkit")
const os              = require("os")
const bodyParser      = require('body-parser')
const crypto          = require('crypto')
const fetch           = require('node-fetch')
const request         = require('request')
const rp              = require('request-promise')
const graph           = require('fbgraph')
const Bluebird        = require("bluebird")

const dotenv          = require('dotenv').config()
const luis            = require('botkit-middleware-luis');


let luisOptions = {serviceUri: process.env.serviceUri};


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


const bot = controller.spawn({})


controller.middleware.receive.use(luis.middleware.receive(luisOptions));


controller.on('tick', function(bot, event) {})


controller.setupWebserver(process.env.port || 3000,function(err,webserver){controller.createWebhookEndpoints(webserver,bot,function(){})})


controller.api.thread_settings.greeting("Lets book a holiday together?!")
controller.api.thread_settings.get_started("sample_get_started_payload")
controller.api.thread_settings.menu([
    {
        "type"    : "postback",
        "title"   : "Hello",
        "payload" : "hello"
    },
    {
        "type"    : "postback",
        "title"   : "Help",
        "payload" : "help"
    },
    {
        "type" : "web_url",
        "title" : "Website",
        "url" : "http://thisismn.com"
    },
])


controller.hears(['hello'], 'message_received', luis.middleware.hereIntent, function(bot, message) {
    bot.reply(message, "Hello there!!");
})


controller.hears(['^holidays'], 'message_received', luis.middleware.hereIntent, function(bot, message) {

    bot.reply(message, "Holidays left");

})


controller.hears(['cookies'], 'message_received', luis.middleware.hereIntent, function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        })
    })
})


// controller.on('message_received', function(bot, message) {
//     bot.reply(message, 'I\'m a bot. Try talking to me like one. I have no idea what you just said!');
//     return false;
// })
