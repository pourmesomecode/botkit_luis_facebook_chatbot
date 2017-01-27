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


    let timetasticAPIOptions_users = {
        uri: 'https://app.timetastic.co.uk:443/api/users',
        auth: {
            bearer: process.env.timetastic_key
        },
        json: true
    }
    let timetasticAPIOptions_holidays = {
        uri: 'https://app.timetastic.co.uk:443/api/holidays',
        auth: {
            bearer: process.env.timetastic_key
        },
        json: true
    }


    controller.hears(['holidays'],'message_received,direct_message,direct_mention,mention', wit.hears,function(bot, message) {
        rp(timetasticAPIOptions_users)
            .then(function (response) {
                let savedData = response;

                graph.get(message.user, function(err, res) {

                    let fullName_FB = res.first_name + " " + res.last_name;

                    for (i in savedData) {
                        let fullName_timetastic = savedData[i].firstname + " " + savedData[i].surname;
                        if (fullName_FB == fullName_timetastic) {

                            console.log(savedData[i]);

                            bot.reply(message, "You have " + savedData[i].allowanceRemaining + " days left. Use them up!!")
                        }
                    }
                })
            })
            .catch(function (err) {
                // API call failed...
            })
    })


    controller.hears(['days'],'message_received,direct_message,direct_mention,mention', wit.hears,function(bot, message) {
        rp(timetasticAPIOptions_holidays)
            .then(function (response) {
                let savedData = response;

                graph.get(message.user, function(err, res) {

                    let fullName_FB = res.first_name + " " + res.last_name;

                    for (i in savedData) {

                        console.log(savedData[i])

                        let fullName_timetastic = savedData[i].userName;

                        if (fullName_FB == fullName_timetastic) {

                            // bot.reply(message, "You have " + savedData[i].allowanceRemaining + " days left. Use them up!!")
                        }
                    }
                })
            })
            .catch(function (err) {
                // API call failed...
            })
    })

}
