module.exports = function (controller) {


    const rp              = require('request-promise')
    const graph           = require('fbgraph')
    const request         = require('request')
    graph.setAccessToken(process.env.fb_access_token);

    const wit             = require('botkit-witai')({
                            accessToken: process.env.accessToken,
                            minConfidence: 0.6,
                            logLevel: 'debug'
    })


    let timetasticAPIOptions = {
        uri: 'https://app.timetastic.co.uk:443/api/users',
        auth: {
            bearer: process.env.timetastic_key
        },
        json: true
    }


    controller.hears(['greetings'],'message_received,direct_message,direct_mention,mention', wit.hears,function(bot, message) {
        bot.reply(message, 'Hey there.')
    })


    controller.on('message_received', function(bot, message) {
        // bot.reply(message, 'Try: `what is my name` or `structured` or `call me captain`');
        console.log(message);
    });


}
