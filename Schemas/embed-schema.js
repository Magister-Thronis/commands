const { Schema, model } = require("mongoose");

const embedSchema = new Schema({
  _id: String,
  users: [Object],
  categories: [Object],
});

const name = "embed";
module.exports = model[name] || model(name, embedSchema);
