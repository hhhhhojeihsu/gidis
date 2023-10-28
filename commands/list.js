const { SlashCommandBuilder } = require('discord.js');
const helper = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List available sticker of chapter')
		.addStringOption(option =>
			option.setName('chapter')
				.setDescription('The string to show chapter')
				.setRequired(true)
				.addChoices(...helper.getChapters(true)))
	,
	async execute(interaction) {
		const target_string = interaction.options.getString("chapter");
		if (target_string === 'meta') {
			return interaction.reply({content: helper.list(), ephemeral: true});
		} else {
			return interaction.reply({content: helper.list(target_string), ephemeral: true});
		}
		if (response.length === 0) {
			return interaction.reply({content: helper.ambigious, ephemeral: true});
		} else {
			return interaction.reply(response);
		}
	},
};
