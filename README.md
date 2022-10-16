**Description**
Embed creator using buttons and message collectors 


**Dependencies**
- Lyx v14 command handler
- mongoose

**File changes**
in your **Index.js ** add
`MessageContent` to your intents Array

and
```js
client.buttons = new Collection();
const { loadButtons } = require("./Handlers/buttonHandler");
loadButtons(client);
```
in your **commandHandler.js**

change 
```js
  Files.forEach((file) => {
    const command = require(file);

    return client.subCommands.set(command.subCommand, command);

    client.commands.set(command.data.name, command);

    commandsArray.push(command.data.toJSON());

    table.addRow(command.data.name, "🟩");
  });
```
to 
```js
Files.forEach((file) => {
    const command = require(file);

    if (command.data) {
      client.commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());
      table.addRow(command.data.name, "🟩");
    } else {
      client.commands.set(command.name, command);
      commandsArray.push(command);
      table.addRow(command.name, "🟩");
    }
  });
```

in your** SlashCommands.js **

change 
```js
    if(!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) 
    return interaction.reply({
      content: "This command is outdated.",
      ephemeral: true
    });

    if(command.developer && interaction.user.id !== "497051543686742026")
    return interaction.reply({
      content: "This command is only available to the developer.",
      ephemeral: true
    });
```
to 
```js
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
```