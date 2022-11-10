const express = require("express"); 

/* import du fichier auth dans dossier middleware afin de vérifier les tokens des utilisateurs sur nos routes */
const auth = require("../middleware/auth"); 

/* utilisation de la classe express.Router pour créer des gestionnaires de routes modulaires et pouvant être montés */
const router = express.Router(); 

/* appelle du fichier sauce dans le dossier controllers */
const saucesCtrl = require("../controllers/sauces"); 

/* appelle du fichier multer-config dans le dossier middleware */
const multer = require("../middleware/multer-config"); 

/* Appel des middleware */
router.post("/sauces", auth, multer, saucesCtrl.createSauce); 
router.get("/sauces/:id", auth, saucesCtrl.getOneSauce);
router.get("/sauces", auth, saucesCtrl.getAllSauce); 
router.put("/sauces/:id", auth, multer, saucesCtrl.modifySauce); 
router.delete("/sauces/:id", auth, saucesCtrl.deleteSauce);
router.post("/sauces/:id/like", auth, saucesCtrl.likedSauce); 

module.exports = router; 
