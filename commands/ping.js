const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!と返信。'),
    execute: async function(interaction) {
		await interaction.reply('Pong!');
	},
};