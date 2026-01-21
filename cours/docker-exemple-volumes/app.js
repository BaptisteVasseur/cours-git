const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'Démonstration des volumes Docker!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    info: 'Modifiez ce fichier et voyez la différence avec/sans volumes!'
  });
});

// Route pour lire un fichier de données
app.get('/data', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'config.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({
        success: true,
        data: data,
        message: 'Données lues depuis le volume'
      });
    } else {
      res.json({
        success: false,
        message: 'Fichier de données non trouvé - créez data/config.json'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route pour écrire des données
app.post('/data', (req, res) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const dataPath = path.join(dataDir, 'config.json');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Écrire les données
    fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
    
    res.json({
      success: true,
      message: 'Données sauvegardées dans le volume',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route pour afficher les logs
app.get('/logs', (req, res) => {
  try {
    const logPath = path.join(__dirname, 'logs', 'app.log');
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, 'utf8');
      res.json({
        success: true,
        logs: logs.split('\n').filter(line => line.trim())
      });
    } else {
      res.json({
        success: false,
        message: 'Aucun log trouvé'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Fonction pour logger
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
  console.log(logMessage.trim());
}

app.listen(port, '0.0.0.0', () => {
  log(`Serveur démarré sur http://localhost:${port}`);
  log('Modifiez le code et rechargez pour voir la différence!');
});
