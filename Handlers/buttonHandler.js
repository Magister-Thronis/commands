async function loadButtons(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Button", "Status");

  await client.buttons.clear();

  const Files = await loadFiles("Buttons");

  Files.forEach((file) => {
    const button = require(file);

    client.buttons.set(button.id, button);

    table.addRow(button.id, "🟩");
  });

  return console.log(table.toString(), "\nButtons Loaded.");
}

module.exports = { loadButtons };
