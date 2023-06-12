require('dotenv').config();
const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const Ec2 = require(path.join(path.dirname(require.main.filename), 'util/ec2.js'))
const _Command_ = require(path.join(path.dirname(require.main.filename), 'util/command.js'))


class Command extends _Command_ {
    setData() {
        super.setName('hey')
        super.setDescription('あいさつに反応してbotが返事します')
        super.addStringOption('instance_name', 'インスタンス名を指定してください')
    }
    async executeCommand(interaction) {
        const instance_name = super.getStringOption(interaction, 'instance_name')
        const ec2 = await Ec2.build(instance_name)
        const instance_id = ec2.instance_id
        return instance_id;
    }
}

console.log(new Command())

module.exports = {
	Command:Command
};