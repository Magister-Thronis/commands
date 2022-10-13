const { EmbedBuilder } = require("discord.js");
const { error, buttons, embeds: e } = require("../util/embed-command-functions");

module.exports = {
  id: "CElimits",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;

    // utilities
    const remaining = 6000 - embeds[1].length;
    const title = 256 - embeds[1].data.title?.length || 256;
    const description = 4096 - embeds[1].data?.description.length || 4096;
    const footer = 1024 - embeds[1].data.footer?.text.length || 1024;
    const author = 256 - embeds[1].data.author?.name.length || 256;
    const fields = 25 - embeds[1].data.fields?.length || 25;

    const LimitsEmbed = new EmbedBuilder()
      .setTitle("Embed Limits")
      .setColor("F4D58D")
      .setFields([
        {
          name: "Title",
          value: `**Remaining:** \`${title}\\256\``,
          inline: true,
        },
        {
          name: "Description",
          value: `**Remaining:** \`${description}\\4096\``,
          inline: true,
        },
        {
          name: "Fields",
          value: `**Remaining:** \`${fields}\\25\``,
          inline: true,
        },
        {
          name: "Footer",
          value: `**Remaining:** \`${footer}\\1024\``,
          inline: true,
        },
        {
          name: "Author",
          value: `**Remaining:** \`${author}\\256\``,
          inline: true,
        },
        {
          name: "Total",
          value: `**Remaining:** \`${remaining}\\6000\``,
          inline: true,
        },
      ]);

    interaction.deferUpdate();

    interaction.message.edit({ embeds: [LimitsEmbed, embeds[1]] });

    buttons(client, interaction);
  },
};
