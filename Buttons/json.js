const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const { buttons, embeds: e } = require("../util/embed-command-functions");

module.exports = {
  id: "CEjson",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;

    const jsonEmbed = e.jsonEmbed;

    interaction.message.edit({
      embeds: [jsonEmbed, embeds[1]],
    });

    const options = {
      all: "All",
      author: "Author",
      title: "Title",
      description: "Description",
      url: "URL",
      color: "Color",
      footer: "Footer",
      thumbnail: "Thumbnail",
      image: "Image",
      fields: "Fields",
    };

    function generateOptions(options) {
      let arr = [];
      for (const [key, value] of Object.entries(options)) {
        arr.push({
          label: value,
          value: key,
        });
      }
      return arr;
    }

    const jsonRow = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("json-select")
        .setPlaceholder("Select an option")
        .setOptions(generateOptions(options))
        .setMinValues(1)
        .setMaxValues(1)
    );

    // create component collector
    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription("Select the JSON you want to use");

    interaction.reply({ embeds: [msgEmbed], components: [jsonRow] });

    buttons(client, interaction, collector);

    let jsonMsg;

    collector.on("collect", async (i) => {
      if (i.customId === "json-select") {
        i.deferUpdate();
        const selected = i.values[0];

        // get json
        let json = JSON.stringify(interaction.message.embeds[1].data[selected], null, 2);

        if (selected === "color") {
          // convert decimal to hex
          json = parseInt(json).toString(16);
        }

        if (selected === "all") {
          json = JSON.stringify(interaction.message.embeds[1].data, null, 2);
        }

        if (json === undefined) {
          interaction.editReply({
            embeds: [EmbedBuilder.from(msgEmbed).setDescription(`**No JSON to show - Edit the ${selected} first**`)],
          });
        } else {
          if (jsonMsg) {
            jsonMsg.delete();
          }

          jsonMsg = await interaction.channel.send({ content: `\`\`\`json\n${json}\n\`\`\`` });
          interaction.editReply({
            embeds: [EmbedBuilder.from(msgEmbed).setDescription(`${selected} **JSON sent to chat**`)],
          });
        }
      }
    });

    collector.on("end", () => {
      // delete jsonMsg
      jsonMsg.delete();
    });
  },
};
