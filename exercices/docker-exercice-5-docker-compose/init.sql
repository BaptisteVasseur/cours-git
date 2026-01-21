-- Script d'initialisation de la base de données
-- Ce fichier est exécuté automatiquement au premier démarrage de MySQL

-- Créer la table users si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer quelques données de test
INSERT INTO users (name, email) VALUES 
    ('Alice Dupont', 'alice@example.com'),
    ('Bob Martin', 'bob@example.com'),
    ('Charlie Durand', 'charlie@example.com')
ON DUPLICATE KEY UPDATE name=name; -- Éviter les erreurs si les données existent déjà

-- Afficher un message de confirmation
SELECT 'Base de données initialisée avec succès!' as message;
