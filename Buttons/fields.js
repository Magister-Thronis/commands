const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Promise } = require("mongoose");

const { error } = require("../util/embed-command-functions");

module.exports = {
  id: "CEfields",

  execute(interaction, client) {
    // embeds
    const embeds = interaction.message.embeds;
    let modifiedEmbed = EmbedBuilder.from(embeds[1]);

    //components
    const rows = interaction.message.components;

    let modifying = "name";
    let newField = { name: "\u200b", value: "\u200b" };

    let fieldEmbed = new EmbedBuilder()
      .setTitle(` Editing fields`)
      .setColor("F4D58D")
      .setDescription(
        `
       **Use the buttons below to set the field data**
       **Click \`set\` to apply**
       **Clicking the \`set\` button without having a name or value will insert a blank {character}**
    `
      )
      .addFields(
        { name: `name`, value: `\u200b`, inline: false },
        { name: `value`, value: `\u200b`, inline: false },
        { name: `inline`, value: `\u200b`, inline: false }
      );

    interaction.message.edit({
      embeds: [fieldEmbed, embeds[1]],
    });

    let msgEmbed = new EmbedBuilder().setColor("F4D58D").setDescription(`**setting \`${modifying}\`:**`);
    interaction.reply({
      embeds: [msgEmbed],
    });

    const filter = (m) => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
    });

    // util buttons --------------------------------------------------------------
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("cancel").setStyle(ButtonStyle.Secondary).setLabel("cancel"),
      new ButtonBuilder().setCustomId("name").setStyle(ButtonStyle.Secondary).setLabel("name"),
      new ButtonBuilder().setCustomId("value").setStyle(ButtonStyle.Secondary).setLabel("value"),
      new ButtonBuilder().setCustomId("inline").setStyle(ButtonStyle.Secondary).setLabel("inline"),
      new ButtonBuilder().setCustomId("set").setStyle(ButtonStyle.Secondary).setLabel("set")
    );

    const buttonFilter = (u) => u.user.id === interaction.user.id;
    buttonCollector = interaction.message.createMessageComponentCollector({
      filter: buttonFilter,
    });

    interaction.message.edit({
      components: [buttonRow],
    });

    buttonCollector.on("collect", (btnInt) => {
      let fields = fieldEmbed.data.fields;

      if (btnInt.component.customId === "cancel") {
        btnInt.deferUpdate();
        buttonCollector.stop();
        collector.stop();
      }
      if (btnInt.component.customId === "name") {
        btnInt.deferUpdate();
        modifying = "name";

        interaction.editReply({
          embeds: [EmbedBuilder.from(msgEmbed).setDescription(`**modifying \`${modifying}\`:**`)],
        });
      }
      if (btnInt.component.customId === "value") {
        btnInt.deferUpdate();
        modifying = "value";

        interaction.editReply({
          embeds: [EmbedBuilder.from(msgEmbed).setDescription(`**modifying \`${modifying}\`:**`)],
        });
      }
      if (btnInt.component.customId === "inline") {
        btnInt.deferUpdate();
        modifying = "inline";

        // toggle inline
        if (newField.inline === true) {
          newField.inline = false;
        } else {
          newField.inline = true;
        }

        // edit the 3rd field in the embed
        fieldEmbed = EmbedBuilder.from(fieldEmbed).setFields(fields[0], fields[1], {
          name: `inline`,
          value: `${newField.inline}`,
        });

        interaction.message.edit({
          embeds: [fieldEmbed, modifiedEmbed],
        });

        interaction.editReply({
          embeds: [EmbedBuilder.from(msgEmbed).setDescription(`**\`${modifying}\`: ${newField.inline}**`)],
        });
      }
      if (btnInt.component.customId === "set") {
        btnInt.deferUpdate();

        let fields = modifiedEmbed.data.fields;
        if (!fields) {
          fields = [];
        }

        // check length of fields is greater  than 25

        if (fields.length >= 25) {
          return interaction.editReply({
            embeds: [EmbedBuilder.from(msgEmbed).setColor("DarkRed").setDescription(`**Max fields have been set**`)],
          });
        }

        fieldEmbed = EmbedBuilder.from(fieldEmbed).setFields(
          { name: `name`, value: `\u200b`, inline: false },
          { name: `value`, value: `\u200b`, inline: false },
          { name: `inline`, value: `\u200b`, inline: false }
        );

        modifiedEmbed = EmbedBuilder.from(modifiedEmbed).addFields(newField);

        newField = { name: "\u200b", value: "\u200b" };

        interaction.message.edit({
          embeds: [fieldEmbed, modifiedEmbed],
        });
        newField;
        interaction.editReply({
          embeds: [EmbedBuilder.from(msgEmbed).setDescription(`**Added: ✅ **`)],
        });
      }
    });
    // util buttons --------------------------------------------------------------end

    collector.on("collect", (m) => {
      let fields = fieldEmbed.data.fields;

      // check value of modifying
      if (modifying === "name") {
        // check length of name is less than 256
        if (m.content.length > 256) return error(interaction, "name is too long", m);

        newField.name = m.content;

        fieldEmbed = EmbedBuilder.from(fieldEmbed).setFields({ name: `name`, value: `set ✅` }, fields[1], fields[2]);

        interaction.message.edit({
          embeds: [fieldEmbed, modifiedEmbed],
        });

        interaction.editReply({
          embeds: [EmbedBuilder.from(msgEmbed).setDescription(`**modifying \`${modifying}\`: ✅**`)],
        });
      }
      if (modifying === "value") {
        // check length of value is less than 1024
        if (m.content.length > 1024) return error(interaction, "value is too long", m);
        newField.value = m.content;

        fieldEmbed = EmbedBuilder.from(fieldEmbed).setFields(fields[0], { name: `value`, value: `set ✅` }, fields[2]);

        interaction.message.edit({
          embeds: [fieldEmbed, modifiedEmbed],
        });

        interaction.editReply({
          embeds: [EmbedBuilder.from(msgEmbed).setDescription(`**modifying \`${modifying}\`: ✅**`)],
        });
      }

      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }).then(() => m.delete());
    });

    collector.on("end", () => {
      interaction.message
        .edit({
          embeds: [embeds[0], modifiedEmbed],
          components: rows,
        })
        .then(interaction.deleteReply());
      return;
    });
  },
};
