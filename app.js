const express = require("express"); 
const mongoose = require("mongoose"); 
const path = require("path"); 
const app = express(); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const result= dotenv.config();

app.set('port',(process.env.PORT||3000));

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use(cors()); 
app.use(express.json()); 

const userRoutes = require("./routes/user"); 
const saucesRoutes = require("./routes/sauces");

mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !")); 

/* indique à Express qu'il faut gérer la ressource images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images */
app.use("/images", express.static(path.join(__dirname, "images"))); 


app.use("/api/auth", userRoutes); 
app.use("/api", saucesRoutes); 

module.exports = app; 