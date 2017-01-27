module.exports = function (controller) {


    const rp              = require('request-promise')
    const request         = require('request')

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


    controller.hears(['holidays'],'message_received,direct_message,direct_mention,mention', wit.hears,function(bot, message) {
        rp(timetasticAPIOptions)
            .then(function (response) {
                request('https://slack.com/api/users.info?token=xoxp-2176818347-2587063009-123555715680-46966bdca1845c06ed5bd491cd9ea99f&user='+ message.user +'', function (error, response, body) {
                    if (!error && response.statusCode == 200) {

                        let slack_responseBody = JSON.parse(body);
                        let slack_responseBody_email = slack_responseBody.user.profile.email;

                        for (i in savedData) {
                            if (savedData[i].email === slack_responseBody_email) {
                                bot.reply(message, "You have " + savedData[i].allowanceRemaining + " days left. Use them up!!")
                            }
                        }

                    } else {
                        bot.reply(message, 'Looks like i\'m not as smart as I thought. Something as gone wrong!')
                    }
                })

                let savedData = response;

            })
            .catch(function (err) {
                // API call failed...
            })
    })

}
