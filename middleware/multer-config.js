/* Package permettant de gérer les fichiers entrants */
const multer = require('multer'); 

/* Package qui fournit des fonctionnalités pour accéder et interagir avec le système de fichiers */
const fs = require('fs'); 

/* dictionnaire des extensions de fichiers entrants */
const MIME_TYPES = { 
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

/* utilisation de la function diskStorage pour dire que l'on va enregistrer sur le disque */
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => { 
        if (!fs.existsSync('images')) { 
            fs.mkdirSync('images'); 
            callback(null, 'images'); 
        } else { 
        callback(null, 'images'); 
        }
    },

/* argument filename qui explique à multer quel nom de fichier utiliser */
    filename: (req, file, callback) => { 
        const name = file.originalname.split(' ').join('_'); 
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);  
    } 
});

module.exports = multer({ storage }).single('image'); 