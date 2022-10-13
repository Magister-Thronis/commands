const { EmbedBuilder } = require("discord.js");
const { error, buttons, embeds: e } = require("../util/embed-command-functions");

module.exports = {
  id: "CEdescription",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = embeds[1];

    // utilities
    const remaining = 6000 - embeds[1].length;

    const descriptionEmbed = e.descriptionEmbed;

    interaction.message.edit({ embeds: [descriptionEmbed, embeds[1]] });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription("**Enter a description:**");
    interaction.reply({ embeds: [msgEmbed] });

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    buttons(client, interaction, collector);

    collector.on("collect", (m) => {
      if (m.content.length >= 4096) {
        return error(interaction, "**Description is too long**", m);
      }

      const description = m.content.length > remaining ? m.content.substring(0, remaining) : m.content;

      // is content json?
      let isJson = false;
      try {
        JSON.parse(description);
        isJson = true;
      } catch (e) {
        isJson = false;
      }

      if (isJson) {
        modifiedEmbed = EmbedBuilder.from(embeds[1]).setDescription(JSON.parse(description));
        interaction.editReply({
          embeds: [msgEmbed.setDescription(`**Modifying description:**`)],
        });
      } else {
        modifiedEmbed = EmbedBuilder.from(embeds[1]).setDescription(`${description}`);
        interaction.editReply({
          embeds: [msgEmbed.setDescription(`**Modifying description:**`)],
        });
      }

      interaction.message
        .edit({
          embeds: [descriptionEmbed, modifiedEmbed],
        })
        .then(() => setTimeout(() => m.delete(), 1000));
    });
  },
};
