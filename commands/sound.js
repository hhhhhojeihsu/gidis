'use strict';

const { ChannelType, SlashCommandBuilder } = require('discord.js');
const {
	createAudioPlayer,
	joinVoiceChannel,
	getVoiceConnection,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
	createAudioResource
} = require('@discordjs/voice');

const { createReadStream } = require('node:fs');

const helper = require('../helper.js');

const player = createAudioPlayer();

async function connect_to_channel(interaction, voice_channel) {
		const connection = joinVoiceChannel({
			channelId: voice_channel,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator
		});

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
			return connection;
		} catch (error) {
			connection.destroy();
			throw error;
		}

}

function play_file(filename) {
		const resource = createAudioResource(
				createReadStream(filename), {
					inputType: StreamType.OggOpus
		});

		player.play(resource);

		return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sound')
		.setDescription('Send sound to voice channel')
		.addStringOption(option =>
			option.setName('string')
				.setDescription('The string to perform fuzzy search')
				.setRequired(true)
				.setAutocomplete(true))
		.addChannelOption(option =>
			option.setName('channel')
				.addChannelTypes(ChannelType.GuildVoice)
				.setDescription('Voice channel name to send to')
				.setRequired(true))
	,
	async execute(interaction) {
		const voice_channel = interaction.options.getChannel('channel');

		try{
			await play_file('./sample.ogg');
		} catch (error) {
			console.log(error);
		}
		try {
			const connection = await connect_to_channel(interaction, voice_channel.id);
			connection.subscribe(player);
			player.guild_id = interaction.guildId;
			await interaction.reply({content: "Playing Now", ephemeral: true});
		} catch(error) {
			console.log(error);
		}

	},
	async autocomplete(interaction) {
		const focused_value = interaction.options.getFocused();
		const fuzzy_result = helper.fuzzyResult(focused_value);
		await interaction.respond(fuzzy_result);
	}
};

player.on(AudioPlayerStatus.Idle, () => {
	setTimeout(() => {
		console.log(player.guild_id);
		if (player.guild_id) {
			console.log("Has Property");
			const connection = getVoiceConnection(player.guild_id);
			if (connection) {
				console.log("Valid colnnection");
				connection.disconnect();
			}
		}
	}, 15e3);
});
