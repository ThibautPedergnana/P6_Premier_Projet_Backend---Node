const Sauce = require("../models/Sauce");

exports.getAll = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.create = (req, res, next) => {
  const sauce = JSON.parse(req.body.sauce);

  if (!req.file) {
    //422 unprocessable entity => données incompletes
    res.status(422).json({ error: "imageUrl is required" });
  }
  console.log(
    `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  );
  const newSauce = new Sauce({
    ...sauce,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  newSauce
    .save()
    .then((obj) => res.status(201).json(obj))
    .catch((error) => res.status(400).json({ error }));
};

exports.edit = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: "Not found",
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: "Requête non autorisée",
        });
      }
      const sauceObject = req.file
        ? {
            ...JSON.parse(req.body),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : req.body;

      Sauce.updateOne({ _id: req.params.id }, sauceObject)
        .then(() => res.status(200).json(req.body))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

exports.remove = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: "Not found",
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: new Error("Requête non autorisée"),
        });
      }
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(204).json({}))
        .catch((error) => res.status(400).json({ error }));

      const filename = sauce.imageUrl?.split("/images/")[1];
      if (filename) fs.unlink(`images/${filename}`, () => {});
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

exports.like = (req, res, next) => {
  const { userId } = req.auth;
  const { like } = req.body;
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      return res.status(404).json({
        error: "Not found",
      });
    }
    let { usersLiked, usersDisliked } = sauce;

    if (like === 1) {
      //like
      if (!usersLiked.includes(userId)) {
        usersLiked.push(userId);
        if (usersDisliked.includes(userId)) {
          usersDisliked = usersDisliked.filter((item) => item !== userId);
        }
      }
    } else if (like === -1) {
      //dislike
      if (!usersDisliked.includes(userId)) {
        usersDisliked.push(userId);
        if (usersLiked.includes(userId)) {
          usersLiked = usersLiked.filter((item) => item !== userId);
        }
      }
    } else {
      // remove
      if (usersLiked.includes(userId)) {
        usersLiked = usersLiked.filter((item) => item !== userId);
      } else if (usersDisliked.includes(userId)) {
        usersDisliked = usersDisliked.filter((item) => item !== userId);
      }
    }

    sauce.usersLiked = usersLiked;
    sauce.usersDisliked = usersDisliked;

    Sauce.updateOne({ _id: req.params.id }, sauce)
      .then(() => res.status(200).json(req.body))
      .catch((error) => res.status(400).json({ error }));
  });
};
