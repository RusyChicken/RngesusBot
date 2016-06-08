var BotCommand = require("./botCommand.js");
var Database = require("./database.js");
var Spawn = require("./spawn.js");

module.exports = [
    new BotCommand("help", function(bot, message) {
        var response = "available commands are:\n" +
            "!spawnmonster\n!stats\n!notices\n!noticesjp\n!elementschedule"
        bot.reply(message, response);
    }),

    new BotCommand("spawnmonster", function(bot, message) {
        var monster = Spawn.getMonster();
        var response = "congratulations you spawned " + monster.description +
            " at " + monster.probability.toString().substr(0, 4) +
            "% probability\n" + monster.url;
        Database.insertSpawn(message.author.id, monster.description);
        bot.reply(message, response);
    }),

    new BotCommand("stats", function(bot, message) {
        var handleResults = function(results) {
            var userSpawnCount = 0;
            var gemsSpent = 0;
            var response = "";
            if (results) {
                var userSpawnCount = results.length;
                gemsSpent = userSpawnCount * 5;
            }
            response = "you have spawned a total of " + userSpawnCount.toString() +
                " monsters.  At 5 gems per spawn, you have spent " + gemsSpent.toString() +
                " gems."
            bot.reply(message, response);
        };
        Database.getSpawnsByUser(message.author.id, handleResults);
    }),

    new BotCommand("notices", function(bot, message) {
        var response = "http://app.en.unisonleague.com/app_en/information.php"
        bot.reply(message, response);
    }),

    new BotCommand("noticesjp", function(bot, message) {
        var response = "http://app.ja.unisonleague.com/app_jp/information.php"
        bot.reply(message, response);
    }),

    new BotCommand("elementschedule", function(bot, message) {
        var response = "Elemental Rush schedule:\n" + 
            "Mon-Light Tue-Fire Wed-Water Thu-Wind Fri-Dark\n" +
            "2:00 AM - 2:59 AM\n7:00 AM - 8:29 AM\n12:20 PM - 12:49 PM\n" +
            "1:20 PM - 2:29 PM\n7:20 PM - 8:29 PM\n10:30 PM - 11:29 PM\n";
        bot.reply(message, response);
    }),

    new BotCommand("createSpawnTable", function(bot, message) {
        Database.createSpawnTable();
    }),

    new BotCommand("grey", function(bot, message) {
        var response = "http://i.imgur.com/vvDBlmz.png";
        bot.reply(message, response);
    }),

];