const CommandPrefix = "!";
const LoginMessage = "Hello everyone, I'm back!";
const LogoutMessage = "Going to sleep now.  Be back in six hours.  *Zzzz...*";
const PlayingGame = "with your gems"

var Discord = require("discord.js");
var commands = require("./commands.js");

var loginToken = process.env["DiscordLoginToken"];
var bot = new Discord.Client({
    "revive": true});

if (loginToken === undefined) {
    console.log("Exiting: Discord login token environment variable is not set");
    process.exit(-1);
}
process.on("SIGINT", function() {
    broadcastMessage(LogoutMessage, function() {
        process.exit(130)});
});
process.on("SIGTERM", function() {
    broadcastMessage(LogoutMessage, function() {
        bot.logout(function() {
            process.exit(128)})});
});
bot.on("message", function(message) {
    if (message.content[0] === CommandPrefix) {
        handleMessageReceived(message);
    }
});

bot.on("ready", function() {
    bot.setPlayingGame(PlayingGame);
    broadcastMessage(LoginMessage);
});

bot.loginWithToken(loginToken, undefined, undefined, function(error) {
    if (error !== null) {
        console.log("Error logging in", error);
    }
});

function broadcastMessage(message, callback) {
    for (channelIndex = 0; channelIndex < bot.channels.length; channelIndex++) {
        var currentChannel = bot.channels[channelIndex];
        if (currentChannel instanceof Discord.TextChannel && currentChannel.name == "general") {
            bot.sendMessage(currentChannel, message, undefined, callback);
        }
    }
}

function handleMessageReceived(message) {
    for (commandIndex = 0; commandIndex < commands.length; commandIndex++) {
        if (message.content === CommandPrefix + commands[commandIndex].trigger) {
            commands[commandIndex].execute(bot, message);
        }
    }
}
