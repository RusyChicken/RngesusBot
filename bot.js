const PlayingGame = "with your gems"
const LoginMessage = "Hello everyone, I'm back!";
const LogoutMessage = "Going to sleep now.  Be back in six hours.  *Zzzz...*";

var Discord = require("discord.js");
var Spawn = require("./spawn.js");

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
    if (message.content[0] === "!") {
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
        if (currentChannel instanceof Discord.TextChannel) {
            bot.sendMessage(currentChannel, message, undefined, callback);
        }
    }
}

function handleMessageReceived(message) {
    if(message.content === "!spawnmonster") {
        var monster = Spawn.getMonster();
        var response = "congratulations you spawned " + monster.description +
            " at " + monster.probability.toString().substr(0, 4) +
            "% probability\n" + monster.url;
        bot.reply(message, response);
    }
    if(message.content === "!notices") {
        var response = "http://app.en.unisonleague.com/app_en/information.php"
        bot.reply(message, response);
    }
    if(message.content === "!noticesjp") {
        var response = "http://app.ja.unisonleague.com/app_jp/information.php"
        bot.reply(message, response);
    }
    if(message.content === "!elementschedule") {
        var response = "Elemental Rush schedule:\n" + 
            "Mon-Light Tue-Fire Wed-Water Thu-Wind Fri-Dark\n" +
            "2:00 AM - 2:59 AM\n7:00 AM - 8:29 AM\n12:20 PM - 12:49 PM\n" +
            "1:20 PM - 2:29 PM\n7:20 PM - 8:29 PM\n10:30 PM - 11:29 PM\n";
        bot.reply(message, response);
    }
    if(message.content === "!help") {
        var response = "available commands are:\n" +
            "!spawnmonster\n!notices\n!noticesjp\n!elementschedule"
        bot.reply(message, response);
    }
}

