const { SlashCommandBuilder } = require('discord.js');

class _Command_ {
  setData() {
    throw new Error("This method must be implemented.")
  }
  
  async executeCommand(interaction) {
    throw new Error("This method must be implemented.")
  }

  constructor() {
    if (this.constructor == _Command_) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.data = new SlashCommandBuilder()
    this.setData()
    this.execute = async function(interaction) {
      await interaction.deferReply();
      const message = await this.executeCommand(interaction)
      await interaction.editReply(message);
    }
  }

  setName(name) {
    this.data.setName(name)
  }

  setDescription(description) {
    this.data.setDescription(description)
  }

  addStringOption(name, description, is_required=true) {
    this.data.addStringOption(option =>
      option
        .setName(name)
        .setDescription(description)
        .setRequired(is_required)
    )
  }

  getStringOption(interaction, name) {
    return interaction.options.getString(name)
  }
}

module.exports = _Command_
