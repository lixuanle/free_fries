// require('dotenv').config({path: '/home/fries_bot/.env'});
require('dotenv').config();
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const botconfig = require("./botconfig.json");
const functions = require('./functions.js');
const KEYAKI_GREEN = 0xa0d468;

bot.on("ready", function() {
  bot.user.setUsername('DID WE GET FRIES?');
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("RAPTORS GAME FOR THE FRIES", {type: 'WATCHING'});
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  //Command to see if we got free fries that day
  if (cmd === prefix + "fries") {
    functions.getFries(bot, message.channel);
  };
});


bot.login(process.env.DISCORD_TOKEN);
