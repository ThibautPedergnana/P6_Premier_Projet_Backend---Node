const express = require("express");
const mongoose = require("mongoose");
const verifyAuthorization = require("./middlewares/verifyAuthorization");
const app = express();
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");
const helmet = require("helmet");

mongoose
  .connect(
    "mongodb+srv://Pedergnana_Thibaut:Azerty123@cluster0.w93ia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// Paramétrage des en-têtes
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

// Sécurisation des en-têtes http
app.use(helmet());

// Routes inscriptions/connections
app.use("/api/auth", userRoutes);

// Vérification des tokens d'authentification
app.use(verifyAuthorization);

// Routes sauces
app.use("/api/sauces", sauceRoutes);

// Sauvegarde des images
app.use("/images", express.static(path.join(__dirname, "images")));

// Export
module.exports = app;
