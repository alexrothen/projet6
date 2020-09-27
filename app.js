//---------------------------------APPLICATIONS

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const helmet = require("helmet");
require('dotenv').config();

const saucesRoutes = require("./routes/sauces");
const usersRoutes = require("./routes/users");


//----------------------------Base de données
mongoose.connect(
    // Identifiants masqués via dotenv
    process.env_user.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//----------------------------Sécurisation des headers
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//----------------------------Transformation de la requête en JSON
app.use(bodyParser.json());

//----------------------------Local path "images"
app.use("/images", express.static(path.join(__dirname, "images")));

//----------------------------Routing
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);

module.exports = app;
