// Importe la bibliothèque Express
const express = require('express');

// Crée une nouvelle application Express
const app = express();

// Définit le port sur lequel ton serveur va écouter
const port = 3000;

// Définit ce qui se passe quand quelqu'un visite la page d'accueil
app.get('/', (req, res) => {  // req = requête reçue, res = réponse à envoyer
  // Envoie une réponse au format JSON
  res.json({
    message: 'Hello Docker!',              // Un message de bienvenue
    version: '1.0.0',                      // La version de ton app
    timestamp: new Date().toISOString()    // L'heure actuelle au format ISO
  });
});

// Démarre le serveur
app.listen(port, '0.0.0.0', () => {  // '0.0.0.0' = écoute sur toutes les interfaces (important pour Docker)
  // Affiche un message quand le serveur démarre
  console.log(`Application démarrée sur http://localhost:${port}`);
});
// azepoazepo
