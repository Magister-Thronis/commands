const { EmbedBuilder } = require("discord.js");
const { error, buttons, embeds: e } = require("../util/embed-command-functions");

module.exports = {
  id: "CEimage",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = embeds[1];

    // utilities

    const imageEmbed = e.imageEmbed;

    interaction.message.edit({ embeds: [imageEmbed, embeds[1]] });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription("**Enter a direct image link:**");
    interaction.reply({ embeds: [msgEmbed] });

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    buttons(client, interaction, collector);

    collector.on("collect", (m) => {
      let image = "";

      image = m.content;

      // check if image is valid picture url
      if (!image.match(/\.(jpeg|jpg|png|gif)$/) || !image.match(/^https?:\/\//)) {
        return error(interaction, "Invalid image link", m);
      }

      interaction.editReply({
        embeds: [msgEmbed.setDescription(`**Send a new link to update the image**`)],
      });

      modifiedEmbed = EmbedBuilder.from(embeds[1]).setImage(image);

      interaction.message
        .edit({
          embeds: [imageEmbed, modifiedEmbed],
        })
        .then(() => setTimeout(() => m.delete(), 1000));
    });
  },
};
