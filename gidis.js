'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const helper = require('./helper.js');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if(msg.author.bot) return;
  if(msg.content.substring(0, 2) === config.GI_PREFIX){
    // Send list using pm
    if(msg.content.substring(2) === 'list') {
      msg.author.send(helper.list());
    }
    else if(msg.content.substring(2, 7) === 'list ') {
      msg.author.send(helper.list(msg.content.substring(7)));
    }
    else {
      var parsed = helper.parseMsg(msg.content.substring(2));
      msg.reply(parsed[0], parsed[1]);
      return;
    }
    // Mention sender if not using PM
    if(msg.channel.type !== 'dm')
    msg.reply('GI Bot has PMed you the list');
	}
});

client.login(config.GI_TOKEN);

