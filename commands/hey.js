require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
const config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
}
const client = new EC2Client(config);

async function ger_instance_id(instance_name) {
    const input = { // DescribeInstancesRequest
        Filters: [{
            "Name": "tag:Name",
            "Values": [
                instance_name
            ],
        }],
    };
    const command = new DescribeInstancesCommand(input);
    const response = await client.send(command);
    if (response.Reservations.length == 0) {
        throw new Error('インスタンスが存在しません')
    }
    if (response.Reservations[0].Instances.length > 1) {
        throw new Error('インスタンス名が被っています')
    } 
    return response.Reservations[0].Instances[0].InstanceId;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hey')
		.setDescription('あいさつに反応してbotが返事します')
        .addStringOption(option =>
            option
                .setName('instance_name')
                .setDescription('インスタンス名を指定します')
                .setRequired(true)
        ),
	execute: async function(interaction) {
		await interaction.deferReply();
        const instance_name = interaction.options.getString('instance_name')
        const message = await ger_instance_id(instance_name);
        await interaction.editReply(message);
	},
};