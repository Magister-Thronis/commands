const { EmbedBuilder } = require("discord.js");
const { error, buttons, embeds: e } = require("../util/embed-command-functions");

module.exports = {
  id: "CEfooter",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = embeds[1];

    // utilities
    const remaining = 6000 - embeds[1].length;

    const footerEmbed = e.footerEmbed;

    interaction.message.edit({ embeds: [footerEmbed, embeds[1]] });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription("**Enter a Footer:**");
    interaction.reply({ embeds: [msgEmbed] });

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    buttons(client, interaction, collector);

    collector.on("collect", (m) => {
      if (m.content.length >= 1024) {
        return error(interaction, "Footer is too long", m);
      }

      interaction.editReply({
        embeds: [msgEmbed.setDescription(`**Footer set to:** \`${m.content}\``)],
      });

      const footer = m.content.length > remaining ? m.content.substring(0, remaining) : m.content;

      modifiedEmbed = EmbedBuilder.from(embeds[1]).setFooter({ text: footer });

      interaction.message
        .edit({
          embeds: [footerEmbed, modifiedEmbed],
        })
        .then(() => setTimeout(() => m.delete(), 1000));
    });
  },
};
