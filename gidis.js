'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const helper = require('./helper.js');

var prefix = config.GI_PREFIX;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if(msg.author.bot) {
    return;
  }
  var content = msg.content.toLowerCase();
  if(content.substring(0, prefix.length) !== prefix) {
    return;
  }

  // Send list using pm
  if(content.substring(prefix.length) === 'help') {
    msg.channel.send(
      "Use `" + prefix + "`list to show list.\n" +
      "Please create an issue on https://github.com/hhhhhojeihsu/gidis");
    return;
  }

  if(content.substring(prefix.length) === 'list') {
    msg.author.send(helper.list());
  } else if(content.substring(prefix.length, 7) === 'list ') {
    msg.author.send(helper.list(msg.content.substring(7)));
  } else {
    var parsed = helper.parseMsg(content.substring(prefix.length));
    if(parsed[0] === "") {
      msg.channel.send(parsed[1]);
    } else {
      msg.channel.send(parsed[0]);
    }
    return;
  }

  // Mention sender if not using PM
  if(msg.channel.type !== 'dm') {
    msg.reply('GI Bot has PMed you the list');
  }
});

client.login(config.GI_TOKEN);

