const { EmbedBuilder } = require("discord.js");
const { error, buttons, embeds: e } = require("../util/embed-command-functions");

module.exports = {
  id: "CEfields_delete",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = EmbedBuilder.from(embeds[1]);

    if (!modifiedEmbed.data.fields) {
      return error(interaction, "No fields to delete");
    }

    // utilities

    const FieldEmbed = e.fieldEmbed;

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    buttons(client, interaction, collector, "delete");

    let msgEmbed = new EmbedBuilder().setColor("F4D58D");

    interaction.reply({
      embeds: [msgEmbed.setDescription("Enter the field index number:")],
    });

    collector.on("collect", (m) => {
      let index = parseInt(m.content);

      if (isNaN(index)) {
        return error(interaction, "Index must be a number", m);
      }
      if (index > 25 || index < 0) {
        return error(interaction, "Index number must be between 0 - 25", m);
      }
      if (!modifiedEmbed.data.fields[index]) {
        return error(interaction, `Index${index} doesn't exist`, m);
      }

      interaction.editReply({
        embeds: [msgEmbed.setDescription(`Field\`${index}\` deleted!`)],
      });

      interaction.message
        .edit({
          embeds: [FieldEmbed, modifiedEmbed.spliceFields(index, 1)],
        })
        .then(() => setTimeout(() => m.delete(), 1000));
    });
  },
};
