const { ButtonInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ButtonInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isButton()) return;
    const Button = client.buttons.get(interaction.customId);
    
    if (interaction.isButton() && !Button) return;

    if (!Button) return interaction.reply({ content: "This button is outdated or not exist.", ephemeral: true });

    Button.execute(interaction, client);
  },
};
