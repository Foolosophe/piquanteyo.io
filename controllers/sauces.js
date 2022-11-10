const Sauce = require("../models/Sauces"); 

/* package de fonctionnalités pour accéder et interagir avec le système de fichiers */
const fs = require("fs"); 

/* récupèration des informations du formulaire */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(
    req.body.sauce
  ); 

  /* Suppression de l'id de base envoyé par le front */
  delete sauceObject._id; 

  /* Copie de tous les éléments de sauceObject */
  const sauce = new Sauce({
    ...sauceObject,

/* Ajout de l'image */
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0 ,
    dislikes: 0,
  });

/* Sauvegarde de la sauce */
  sauce
    .save() 
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* Recherche de la sauce avec son id */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  }) 
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

/* Affichage de toutes les sauces */
exports.getAllSauce = (req, res, next) => {
  Sauce.find() 
    .then((sauces) => {
      
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/* Modification des sauces*/
exports.modifySauce = (req, res, next) => {
  var sauceObject = {}; 
  if (req.file) {
    sauceObject = {
      ...JSON.parse(
        req.body.sauce
      ),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
  } else {
    sauceObject = { ...req.body }; 
  }

  /* Supression de l'id recupéré par le nouvel objet par sécurité */
  delete sauceObject._userId; 
  Sauce.findOne({
    _id: req.params.id,
  }) 
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({
          message: "action non-autorisée",
        }); 
      } else {
        Sauce.updateOne(
          {
            _id: req.params.id,
          } ,
          {
            ...sauceObject,
            _id: req.params.id,
          } 
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/* Suppression d'une sauce */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id, 
  }) 
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      Sauce.deleteOne({
        _id: req.params.id,
      }) 
        .then(() => {
          fs.unlink(`images/${filename}`, () => {});
          res.status(200).json({ message: "Sauce supprimée !" });
        })
        .catch((error) => res.status(400).json({ error }));
      })
    .catch((error) => res.status(500).json({ error }));
};

/* si l'utilisateur like une sauce */
exports.likedSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (req.body.like == 1 && !sauce.usersLiked.includes(req.body.userId)) {
      Sauce.updateOne(
        { _id: req.params.id } ,
        {
          $inc: { likes: 1 }, 
          $push: { usersLiked: req.body.userId },
        }
      )
        .then(() =>
          res.status(200).json({ message: "Vous avez liké la sauce ! :)" })
        )
        .catch((error) => res.status(400).json({ error }));

        /* si l'utilisateur dislike une sauce */
    } else if (req.body.like == -1 && !sauce.usersDisliked.includes(req.body.userId)) {
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
        } 
      )
        .then(() =>
          res.status(200).json({ message: "Vous avez disliké la sauce ! :(" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else {
      if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          } 
        )
          .then(() =>
            res.status(200).json({ message: "Vous avez disliké la sauce ! :(" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          } 
        )
          .then(() =>
            res.status(200).json({ message: "Vous avez disliké la sauce ! :(" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    }
  });
};
