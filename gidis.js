'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ActivityType, Client, Collection, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

client.commands = new Collection();

const config = require('./config.json');
const helper = require('./helper.js');

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

var prefix = config.GI_PREFIX;

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('!!list for list', { type: ActivityType.Watching });
});

client.on('messageCreate', async msg => {
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

client.on(Events.InteractionCreate, async interaction => {
  const command = client.commands.get(interaction.commandName);


	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

  try {
    if (interaction.isAutocomplete()) {
      await command.autocomplete(interaction);
    } else if (interaction.isChatInputCommand()) {
      await command.execute(interaction);
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.login(config.GI_TOKEN);

