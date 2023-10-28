const { SlashCommandBuilder } = require('discord.js');

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
		return interaction.reply(target_string);
	},
	async autocomplete(interaction) {
		const focused_value = interaction.options.getFocused();
		console.log(focused_value)
		// TODO: From list.json
		const choices = ['A', 'B', 'C'];
		// TODO: Filter
		const filtered = choices.filter(choice => choice.startsWith(focused_value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	}
};
