const { CommandInteraction, InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction, client) {
    const command = client.commands.get(interaction.commandName);

    if (interaction.isChatInputCommand()) {
      if (!command) return interaction.reply({ content: "This command is outdated!", ephemeral: true });
      if (command.developer && interaction.user.id !== "270531731960889344")
        return interaction.reply({
          content: "This command is only available to the developer.",
          ephemeral: true,
        });

      command.execute(interaction, client);
    }

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      command.autocomplete(interaction, client);
    }
  },
};
