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


const credentials = {
    client: {
        id: process.env.client_id,
        secret: process.env.client_secret
    },
    auth: {
        tokenHost: 'https://api.oauth.com'
    }
};


const botkit          = require("botkit")
const os              = require("os")
const commandLineArgs = require("command-line-args")
const bodyParser      = require('body-parser')
const crypto          = require('crypto')
const express         = require('express')
const fetch           = require('node-fetch')
const request         = require('request')
const oauth2          = require('simple-oauth2').create(credentials);


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


controller.on('tick', function(bot, event) {
  // Do nothing - here to prevent constant log on 'no tick handler' message in console
})


controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function(){
        console.log("Online!")
    })
})


controller.api.thread_settings.greeting("Hello! Ask me about your favourite football team!")
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
        "url" : "http://www.bbc.co.uk/sport"
    },
])


controller.hears(['hello'], 'message_received', function(bot, message) {
    bot.reply(message, 'Hey there.');
})


controller.hears(['cookies'], 'message_received', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        })
    })
})


controller.on('message_received', function(bot, message) {
    bot.reply(message, 'I\'m a bot. Try talking to me like one. I have no idea what you just said!');
    return false;
})
