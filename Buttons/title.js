const { EmbedBuilder } = require("discord.js");
const { error, buttons, embeds: e } = require("../util/embed-command-functions");

module.exports = {
  id: "CEtitle",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = embeds[1];

    // utilities
    const remaining = 6000 - embeds[1].length;

    const titleEmbed = e.titleEmbed;

    interaction.message.edit({ embeds: [titleEmbed, embeds[1]] });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription("**Enter a title:**");
    interaction.reply({ embeds: [msgEmbed] });

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    buttons(client, interaction, collector);

    collector.on("collect", (m) => {
      if (m.content.length >= 256) {
        return error(interaction, "Title is too long", m);
      }

      // is content json?
      let isJson = false;
      try {
        JSON.parse(m.content);
        isJson = true;
      } catch (e) {
        isJson = false;
      }

      if (isJson) {
        console.log(JSON.parse(m.content));

        modifiedEmbed = EmbedBuilder.from(embeds[1]).setTitle(JSON.parse(m.content));
        interaction.editReply({
          embeds: [msgEmbed.setDescription(`**Title set to:** \`${JSON.parse(m.content)}\``)],
        });
      } else {
        const title = m.content.length > remaining ? m.content.substring(0, remaining) : m.content;

        modifiedEmbed = EmbedBuilder.from(embeds[1]).setTitle(title);

        interaction.editReply({
          embeds: [msgEmbed.setDescription(`**Title set to:** \`${m.content}\``)],
        });
      }

      interaction.message
        .edit({
          embeds: [titleEmbed, modifiedEmbed],
        })
        .then(() => setTimeout(() => m.delete(), 1000));
    });
  },
};
