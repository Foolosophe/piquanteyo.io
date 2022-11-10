const User = require('../models/user'); 

/* package de chiffrement bcrypt */
const bcrypt = require('bcrypt'); 

/* package permettant de créer et vérifier les tokens d'authentification */
const jwt = require('jsonwebtoken'); 

/* Création des middleware */

exports.signup = (req, res, next) => {

/* Création d'un hash crypté du mdp de l'utilisateur */
  bcrypt.hash(req.body.password, 10) 

/* Récuperation du hash du mdp */
    .then(hash => { 

/* Création du nouvel utilisateur avec mongoose */
      const signupUser = new User({ 

/* Récupèration de l'adresse du nouvel utilisateur */
        email: req.body.email, 

/* Enregistrement du hash du mdp */
        password: hash 
      });

/* Sauvegarde du nouvel utilisateur */
      signupUser.save() 
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}; 

exports.login = (req, res, next) => {

/* Recherche dans la bdd l'email de l'utilisateur */
  User.findOne({ email: req.body.email }) 
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Paire identifiant / mot de passe incorrecte !' }); 
      }
      bcrypt.compare(req.body.password, user.password) 
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' }); 
          }
          res.status(200).json({ 
            userId: user._id, 
            token: jwt.sign( 
              { userId: user._id }, 
              'RANDOM_TOKEN_SECRET', 
              { expiresIn: '24h' } 
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};