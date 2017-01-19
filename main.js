/**
 * Created by charlesanthonybrowne on 19/01/2017.
 */


const botkit = require("botkit")


if (!process.env.token) {
    console.log("Error: Token in environment missing")
    process.exit(1)
}


const controller = botkit.facebookbot({
    debug: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token
})


const bot = controller.spawn({})


controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function(){
        console.log("Online!")
    })
})


controller.heaers(["hello"], "message_received", function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) bot.reply(message, "hello " + user.name + "!!");
        else bot.reply(message, "hello.");
    })
})


controller.on("message_received", function(bot, message) {
    bot.reply(message, "Test")
    return false;
})


