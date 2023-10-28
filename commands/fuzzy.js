const { SlashCommandBuilder } = require('discord.js');
const helper = require('../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fuzzy')
		.setDescription('Fuzzy search stickers')
		.addStringOption(option =>
			option.setName('string')
				.setDescription('The string to perform fuzzy search')
				.setRequired(true)
				.setAutocomplete(true))
	,
	async execute(interaction) {
		const target_string = interaction.options.getString("string");
		var response = helper.getStickerPath(target_string);
		if (response.length === 0) {
			return interaction.reply({content: helper.ambigious, ephemeral: true});
		} else {
			return interaction.reply(response);
		}
	},
	async autocomplete(interaction) {
		const focused_value = interaction.options.getFocused();
		const fuzzy_result = helper.fuzzyResult(focused_value);
		await interaction.respond(fuzzy_result);
	}
};
