class Relay {
    constructor(slackChannel, twitchChannel, twitchMod) {
        this.slackBot;
        this.twitchBot;
        this.slackChannel = slackChannel;
        this.twitchChannel = twitchChannel;
        this.twitchMod = twitchMod;
    }

    createBot(bot, type) {
        switch (type.toLowerCase()) {
        case 'slack':
            this.slackBot = bot;
            break;
        case 'twitch':
            this.twitchBot = bot;
            break;
        default:
            console.error('Unsupported bot type. Only Slack and Twitch bots are allowed');
        }
    }

    sendMessage(user, message, destination) {
        console.log('Relay has received message: ', message);
        console.log('From:', user);
        console.log('To:', destination);

        function getMessageForSlack(twitchMod)
        {
            console.log(twitchMod);
            if (twitchMod && user === twitchMod && message.substring(0, 1) === "!")
            {
                //This is a mod command that doesn't need to be sent to Slack
                console.log("Not sending to Slack:", message);
                return undefined;
            }
            else
            {
                return `*${ user }* said: \n>>>${ message }`;
            }
        }

        function getMessageForTwitch()
        {
            var regex = /^<@.*\|.*> (has (joined|left) the channel|set the channel (purpose|topic))/;

            if (message.match(regex))
            {
                console.log("Not sending to Twitch:", message);
                return undefined;
            }
            else
            {
                return `On Slack, ${ user } said: ${ message }`;
            }
        }

        switch (destination.toLowerCase()) {
        case 'slack':
            message = getMessageForSlack(this.twitchMod);
            if (message)
            {
                this.slackBot.postMessageToChannel(this.slackChannel, message);
            }
            break;
        case 'twitch':
            message = getMessageForTwitch();
            if (message)
            {
                this.twitchBot.action(this.twitchChannel, message);
            }
            break;
        default:
            console.error('Trying to send message to unknown destination.');
        }
    }
}

module.exports = Relay;
