const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'myapp'
};

// Configuration de l'email (MailHog)
const emailConfig = {
  host: process.env.MAIL_HOST || 'mailhog',
  port: process.env.MAIL_PORT || 1025,
  secure: false, // true for 465, false for other ports
  ignoreTLS: true, // MailHog n'utilise pas TLS
  // Pas d'auth pour MailHog
};

let db;
let transporter;

// Initialisation de la base de données
async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion à MySQL établie');
    
    // Créer la table users si elle n'existe pas
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table users créée/vérifiée');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    // Retry après 5 secondes
    setTimeout(initDatabase, 5000);
  }
}

// Initialisation de l'email
function initEmail() {
  try {
    transporter = nodemailer.createTransport(emailConfig);
    console.log('✅ Configuration email (MailHog) initialisée');
  } catch (error) {
    console.error('❌ Erreur configuration email:', error);
  }
}

// Routes

// Page d'accueil avec informations sur les services
app.get('/', (req, res) => {
  res.json({
    message: 'Hello Docker Compose! 🐳',
    version: '1.0.0',
    services: {
      database: 'MySQL disponible',
      email: 'MailHog disponible',
      admin: 'phpMyAdmin disponible sur le port 8080'
    },
    endpoints: {
      '/users': 'GET - Liste des utilisateurs',
      '/users': 'POST - Créer un utilisateur',
      '/send-email': 'POST - Envoyer un email de test'
    },
    timestamp: new Date().toISOString()
  });
});

// Récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Base de données non disponible' });
    }
    
    const [rows] = await db.execute('SELECT * FROM users ORDER BY created_at DESC');
    res.json({
      success: true,
      users: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un nouvel utilisateur
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Nom et email requis' });
    }
    
    if (!db) {
      return res.status(500).json({ error: 'Base de données non disponible' });
    }
    
    const [result] = await db.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: {
        id: result.insertId,
        name,
        email
      }
    });
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Cet email existe déjà' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
});

// Envoyer un email de test
app.get('/send-email', async (req, res) => {
  try {
    const to = 'test@example.com';
    const subject = 'Test';
    const message = 'Hello from Docker!';
        
    const mailOptions = {
      from: 'noreply@monapp.com',
      to: to,
      subject: subject,
      text: message,
      html: `<p>${message}</p><p><em>Envoyé depuis l'app Docker Compose</em></p>`
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Email envoyé avec succès',
      info: 'Vérifiez MailHog sur http://localhost:8025'
    });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ error: 'Erreur envoi email' });
  }
});

// Route de santé pour vérifier les services
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {}
  };
  
  // Vérifier MySQL
  try {
    if (db) {
      await db.execute('SELECT 1');
      health.services.mysql = 'OK';
    } else {
      health.services.mysql = 'DISCONNECTED';
    }
  } catch (error) {
    health.services.mysql = 'ERROR';
  }
  
  // Vérifier MailHog (simple vérification de config)
  health.services.mailhog = transporter ? 'OK' : 'NOT_CONFIGURED';
  
  const allOk = Object.values(health.services).every(status => status === 'OK');
  
  res.status(allOk ? 200 : 503).json(health);
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur Express démarré sur le port ${port}`);
  console.log(`Application disponible sur http://localhost:${port}`);
  console.log(`phpMyAdmin disponible sur http://localhost:8080`);
  console.log(`MailHog disponible sur http://localhost:8025`);
  
  // Initialiser les services
  initDatabase();
  initEmail();
});

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  console.log('🛑 Arrêt du serveur...');
  if (db) {
    await db.end();
    console.log('✅ Connexion MySQL fermée');
  }
  process.exit(0);
});
