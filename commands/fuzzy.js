const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fuzzy')
		.setDescription('Fuzzy search stickers'),
	async execute(interaction) {
		return interaction.reply("Fuzzy");
	},
};
