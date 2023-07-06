const db = require("../models");
const Section = db.section;

exports.create = (req, res) => {
  console.log(req.body);
  const section = new Section({
    title: req.body.section.title,
    cards: req.body.section.cards,
    id: req.body.section.id,
    user_id: req.body.user_id,
  });

  section.save((err, section) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });
};

exports.update = (req, res) => {
  console.log("In section update");
  Section.findOneAndUpdate(
    {
      id: req.params.id,
    },
    { cards: req.body.cards },
    { new: true, upsert: true }
  ).exec((err, section) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    res.status(200).send(section);
  });
};

exports.delete = (req, res) => {
  Section.find({
    id: req.params.id,
  })
    .remove()
    .exec();
};
exports.get = (req, res) => {
  console.log("User id: ", req.params.user_id);
  Section.find({
    user_id: req.params.user_id,
  }).exec((err, sections) => {
    console.log("Sections found by user: ", sections);
    if (err) {
      res.status(500).send({ message: err });
    }
    res.status(200).send(sections);
  });
};
