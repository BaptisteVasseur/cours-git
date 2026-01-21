# TP Docker 6 : Orchestrer plusieurs services avec Docker Compose

**Objectif :** Apprendre à utiliser Docker Compose pour orchestrer une application multi-services avec base de données, interface d'administration et serveur email.

## Mission 1 : Découvrir l'architecture multi-services

### Étape 1 : Comprendre le projet
Tu vas travailler avec une application Node.js qui utilise plusieurs services :
- **Node.js** : L'application web principale
- **MySQL** : Base de données pour stocker les utilisateurs
- **phpMyAdmin** : Interface web pour gérer MySQL
- **MailHog** : Serveur email de test pour capturer les emails

### Étape 2 : Créer le projet
1. Crée un nouveau dossier `mon-app-compose`
2. Tu vas créer tous les fichiers nécessaires étape par étape

**Structure finale attendue :**
```
mon-app-compose/
├── app.js                # Application Node.js avec routes API
├── package.json          # Dépendances (express, mysql2, nodemailer)
├── Dockerfile           # Image pour l'app Node.js
├── docker-compose.yml   # Orchestration des services
└── init.sql            # Script d'initialisation MySQL
```

### Étape 3 : Créer le package.json
Crée le fichier `package.json` avec les dépendances nécessaires pour :
- **Express** : Framework web Node.js
- **mysql2** : Driver pour se connecter à MySQL
- **nodemailer** : Pour envoyer des emails
- **cors** : Pour gérer les requêtes cross-origin
- **nodemon** : Pour le rechargement automatique en développement

**Questions :**
- Pourquoi avons-nous besoin de `mysql2` et `nodemailer` ?
- À quoi sert `cors` dans une API ?
- Quelle est la différence entre `dependencies` et `devDependencies` ?

### Étape 4 : Créer l'application Node.js
Crée le fichier `app.js` qui doit contenir :

**Structure de base :**
- Import des modules : `express`, `mysql2/promise`, `nodemailer`, `cors`
- Configuration des middlewares Express
- Configuration de la base de données (utilise les variables d'environnement)
- Configuration email pour MailHog (pas d'authentification)
- Fonctions d'initialisation avec retry pour MySQL

**Routes à créer :**
- `GET /` : Page d'accueil avec infos sur les services
- `GET /users` : Lister tous les utilisateurs
- `POST /users` : Créer un nouvel utilisateur
- `GET /send-email` : Envoyer un email de test
- `GET /health` : Vérifier la santé des services

**Points importants :**
- Utilise `process.env.DB_HOST || 'mysql'` pour la config
- Gère les erreurs de connexion avec retry automatique
- MailHog n'a pas besoin d'authentification
- Écoute sur `0.0.0.0` pour Docker

**Questions importantes :**
- Pourquoi utilise-t-on `process.env.DB_HOST || 'mysql'` ?
- Que fait la fonction `initDatabase()` et pourquoi le retry ?
- Comment l'app sait-elle comment contacter les autres services ?

### Étape 5 : Créer le Dockerfile
Crée un `Dockerfile` optimisé pour l'application avec :
- Image de base Node.js Alpine
- Répertoire de travail `/app`
- Copie des fichiers de dépendances en premier (cache)
- Installation des dépendances
- Copie du code source
- Exposition du port 3000
- Commande de démarrage

### Étape 6 : Créer le script d'initialisation MySQL
Crée le fichier `init.sql` qui doit :
- Créer la table `users` avec les colonnes : id, name, email, created_at
- Insérer quelques données de test
- Gérer les doublons avec `ON DUPLICATE KEY UPDATE`

## Mission 2 : Créer le docker-compose.yml

### Étape 1 : Comprendre les besoins
Ton `docker-compose.yml` doit orchestrer 4 services :

1. **app** : Ton application Node.js
2. **mysql** : Base de données MySQL
3. **phpmyadmin** : Interface web pour gérer MySQL
4. **mailhog** : Serveur email de test

### Étape 2 : Indices pour créer le docker-compose.yml

**Pour le service `app` :**
- Utilise `build: .` pour construire depuis ton Dockerfile
- Expose le port 3000
- Définis les variables d'environnement pour MySQL et MailHog
- Utilise `depends_on` pour attendre MySQL et MailHog
- Pense au `restart: unless-stopped`, à quoi ça sert ?

**Pour le service `mysql` :**
- Utilise l'image `mysql:8.0`
- Définis les variables d'environnement : `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`
- Monte le fichier `init.sql` dans `/docker-entrypoint-initdb.d/`

**Pour le service `phpmyadmin` :**
- Utilise l'image `phpmyadmin/phpmyadmin:latest`
- Configure `PMA_HOST` pour pointer vers le service MySQL
- Expose sur le port 8080
- Dépend du service MySQL

**Pour le service `mailhog` :**
- Utilise l'image `mailhog/mailhog:latest`
- Expose les ports 8025 (interface web) et 1025 (SMTP)

**Autres éléments importants :**
- Crée un réseau personnalisé pour tous les services
- Définis un volume nommé pour MySQL
- Utilise la version '3.8' du format Compose

### Étape 3 : Structure de base à compléter

```yaml
version: '3.8'

services:
  app:
    # À toi de compléter !
    # Pense à : build, ports, environment, depends_on, restart
    
  mysql:
    # À toi de compléter !
    # Pense à : image, environment
    
  phpmyadmin:
    # À toi de compléter !
    # Pense à : image, environment, ports, depends_on
    
  mailhog:
    # À toi de compléter !
    # Pense à : image, ports

```

<details>
<summary>🆘 Aide si tu es bloqué sur le docker-compose.yml</summary>

**Variables d'environnement importantes :**
- `DB_HOST=mysql` (nom du service)
- `DB_USER=root`, `DB_PASSWORD=rootpassword`
- `MAIL_HOST=mailhog`, `MAIL_PORT=1025`

**Volumes MySQL :**
- Volume persistant pour `/var/lib/mysql`
- Montage du script `init.sql` dans `/docker-entrypoint-initdb.d/`

**Ports à mapper :**
- `3000:3000` : App Node.js
- `8080:80` : phpMyAdmin  
- `8025:8025` : Interface MailHog
- `1025:1025` : SMTP MailHog

**Images à utiliser :**
- `mysql:8.0`
- `phpmyadmin/phpmyadmin:latest`
- `mailhog/mailhog:latest`
</details>

## Mission 3 : Lancer l'environnement complet

### Étape 1 : Premier démarrage
1. Ouvre un terminal dans le dossier `mon-app-compose`
2. Vérifie que tu as bien tous les fichiers créés
3. Lance tous les services :

<details>
<summary>💡 Commande pour démarrer</summary>

```bash
docker compose up -d
```
</details>

3. Observe les logs de démarrage :

<details>
<summary>💡 Commande pour voir les logs</summary>

```bash
docker compose logs -f
```
</details>

**Questions :**
- Dans quel ordre les services démarrent-ils ?
- Combien de temps MySQL prend-il pour être prêt ?
- Y a-t-il des erreurs de connexion au début ? (C'est normal !)
- Que se passe-t-il si ton docker-compose.yml a des erreurs ?

### Étape 2 : Vérifier que tout fonctionne
Teste chaque service dans ton navigateur :

1. **Application Node.js** : http://localhost:3000
   - Tu devrais voir un JSON avec les infos de l'app
2. **phpMyAdmin** : http://localhost:8080 
   - Connecte-toi avec : utilisateur `root`, mot de passe `rootpassword`
   - Vérifie que la base `myapp` existe avec la table `users`
3. **MailHog** : http://localhost:8025
   - Interface pour voir les emails capturés

**Si ça ne marche pas :**
- Vérifie les logs avec `docker compose logs`
- Assure-toi que les ports ne sont pas déjà utilisés
- Vérifie la syntaxe de ton docker-compose.yml

**Questions :**
- Les utilisateurs créés apparaissent-ils dans phpMyAdmin ?
- L'email apparaît-il dans MailHog ?
- Que se passe-t-il si tu redémarres les services ?

## Mission 4 : Explorer la persistance des données

### Étape 1 : Tester la persistance
1. Crée quelques utilisateurs via l'API
2. Arrête tous les services :

<details>
<summary>💡 Commande pour arrêter</summary>

```bash
docker compose down
```
</details>

3. Redémarre les services
4. Vérifie si les utilisateurs sont toujours là

### Étape 2 : Explorer les volumes
1. Liste les volumes Docker :

<details>
<summary>💡 Commande pour lister les volumes</summary>

```bash
docker volume ls
```
</details>

2. Inspecte le volume MySQL :

<details>
<summary>💡 Commande pour inspecter</summary>

```bash
docker volume inspect mon-app-compose_mysql_data
```
</details>

**Questions :**
- Où sont stockées physiquement les données MySQL ?
- Que se passe-t-il si tu supprimes le volume ?
- Pourquoi l'app Node.js n'a-t-elle pas besoin de volume ?

## Mission 5 : Débugger et monitorer

### Étape 1 : Explorer les logs
1. Voir les logs d'un service spécifique :

<details>
<summary>💡 Commandes pour les logs</summary>

```bash
docker compose logs app
docker compose logs mysql
docker compose logs -f mailhog  # Suivi en temps réel
```
</details>

### Étape 2 : Accéder aux containers
1. Ouvre un shell dans l'app Node.js :

<details>
<summary>💡 Commande pour accéder au container</summary>

```bash
docker compose exec app sh
```
</details>

2. Teste la connectivité réseau :
```bash
# Dans le container app
ping mysql
ping mailhog
nslookup phpmyadmin
```

### Étape 3 : Inspecter la base de données
1. Accède au container MySQL :

<details>
<summary>💡 Commande pour accéder à MySQL</summary>

```bash
docker compose exec mysql mysql -u root -p
# Mot de passe: rootpassword
```
</details>

2. Explore la base :
```sql
SHOW DATABASES;
USE myapp;
SHOW TABLES;
SELECT * FROM users;
```

**Questions :**
- Les services peuvent-ils se "voir" entre eux ?
- Comment Docker Compose gère-t-il la résolution DNS ?
- Que contient exactement la table users ?

## Mission 6 : Modifier et redéployer

### Étape 1 : Modifier l'application
1. Ajoute une nouvelle route dans `app.js` :

```javascript
// Nouvelle route pour compter les utilisateurs
app.get('/stats', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Base de données non disponible' });
    }
    
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM users');
    res.json({
      success: true,
      total_users: rows[0].total,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
```

### Étape 2 : Redéployer seulement l'app
1. Rebuild et redémarre seulement le service app :

<details>
<summary>💡 Commandes pour redéployer</summary>

```bash
docker compose build app
docker compose up -d app
```
</details>

2. Teste la nouvelle route :
```bash
curl http://localhost:3000/stats
```

**Questions :**
- Pourquoi les autres services n'ont-ils pas redémarré ?
- Les données MySQL sont-elles toujours là ?
- Combien de temps a pris le redéploiement ?

## Bilan du TP

### Ce que tu as appris
- ✅ Orchestrer plusieurs services avec Docker Compose
- ✅ Gérer les dépendances entre services
- ✅ Utiliser des volumes pour la persistance
- ✅ Configurer des réseaux Docker
- ✅ Débugger une application multi-services
- ✅ Gérer différents environnements (dev/prod)
- ✅ Monitorer et maintenir des services

### Questions de validation
Peux-tu répondre à ces questions ?
1. Quelle est la différence entre `docker run` et `docker compose` ?
2. Comment les services communiquent-ils entre eux ?
3. Pourquoi utiliser des volumes nommés plutôt que des bind mounts ?
4. Comment gérer les secrets en production ?
5. Que se passe-t-il si un service crash ?

### Prochaines étapes
Maintenant que tu maîtrises Docker Compose, tu peux :
- Faire l'[exercice 5 sur le CI/CD](./docker-exercice-5.md)
- Approfondir avec le [cours Docker avancé](../cours/DOCKER-COURS-2.md)
- Essayer de containeriser tes propres projets multi-services
- Explorer Kubernetes pour l'orchestration à grande échelle
- Apprendre les patterns de microservices

### Ressources pour aller plus loin
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/compose/compose-file/)
- [Best practices multi-stage builds](https://docs.docker.com/develop/dev-best-practices/)
- [Docker networking](https://docs.docker.com/network/)

### Commandes utiles à retenir
```bash
# Gestion des services
docker compose up -d                    # Démarrer en arrière-plan
docker compose down                     # Arrêter et supprimer
docker compose restart app              # Redémarrer un service
docker compose build app               # Rebuild un service

# Monitoring
docker compose logs -f app              # Suivre les logs
docker compose ps                       # État des services
docker compose top                      # Processus en cours

# Maintenance
docker compose exec app sh              # Shell dans un container
docker compose pull                     # Mettre à jour les images
docker system prune                     # Nettoyer le système
```
