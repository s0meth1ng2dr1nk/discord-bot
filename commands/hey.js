require('dotenv').config();
const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const Ec2 = require(path.join(path.dirname(require.main.filename), 'util/ec2.js'))

const ARG1 = 'instance_name'

async function executeCommand(interaction) {
    const instance_name = interaction.options.getString(ARG1)
    const ec2 = await Ec2.build(instance_name)
    const message = await ec2.start_instance()
    return message;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hey')
		.setDescription('あいさつに反応してbotが返事します')
        .addStringOption(option =>
            option
                .setName(ARG1)
                .setDescription('インスタンス名を入力してください')
                .setRequired(true)
        ),
	execute: async function(interaction) {
		await interaction.deferReply();
        const message = await executeCommand(interaction);
        await interaction.editReply(message);
	},
};
