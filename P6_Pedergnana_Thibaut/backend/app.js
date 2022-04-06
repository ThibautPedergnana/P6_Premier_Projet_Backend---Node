const express = require("express");
const mongoose = require("mongoose");
const verifyAuthorization = require("./middlewares/verifyAuthorization");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
mongoose
  .connect(
    "mongodb+srv://Pedergnana_Thibaut:Azerty123@cluster0.w93ia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// app.options("*", cors());
app.use(
  cors({
    origin: "*",
  })
);

// // Paramétrage des en-têtes
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });

// Sécurisation des en-têtes http
app.use(helmet());

// Routes inscriptions/connections
app.use("/api/auth", userRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

// Vérification des tokens d'authentification
app.use(verifyAuthorization);

// Routes sauces
app.use("/api/sauces", sauceRoutes);

// Sauvegarde des images

// Export
module.exports = app;
