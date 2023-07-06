const mongoose = require("mongoose");

const Section = mongoose.model(
  "Section",
  new mongoose.Schema({
    id: String,
    user_id: String,
    title: String,
    cards: [
      {
        title: String,
        description: String,
        createdTime: Date,
        timeToSpend: String,
        id: String,
      },
    ],
  })
);

module.exports = Section;
