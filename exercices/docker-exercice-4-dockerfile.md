# TP Docker 4 : Créer et optimiser des Dockerfiles

**Objectif :** Apprendre à créer des Dockerfiles efficaces, comprendre le cache Docker et maîtriser les multi-stage builds.

## Mission 1 : Créer ton premier Dockerfile

### Étape 1 : Préparer le projet
1. Crée un nouveau dossier `mon-app-docker`
2. Dans ce dossier, crée les fichiers suivants :

#### Fichier `package.json`
```json
{
  "name": "mon-app-docker",              // Le nom de ton projet (utilisé par npm)
  "version": "1.0.0",                    // Version de ton app (format semver : major.minor.patch)
  "description": "Application pour apprendre Docker",  // Description courte de ton projet
  "main": "app.js",                      // Fichier principal à exécuter
  "scripts": {                           // Commandes personnalisées que tu peux lancer avec npm run
    "start": "node app.js"               // Script qui lance ton app avec npm start
  },
  "dependencies": {                      // Bibliothèques dont ton app a besoin
    "express": "^4.18.0"                 // Framework web pour Node.js (comme un serveur web simplifié)
  }
}
```

#### Fichier `app.js`
```javascript
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
```

#### Fichier `Dockerfile`
Pour l'instant, laisse ce fichier vide. Tu vas le remplir à l'étape suivante !

### Étape 1.5 : Tester ton app localement (optionnel mais recommandé)
Avant de dockeriser, vérifie que ton app fonctionne :

1. **Installer les dépendances :**
   ```bash
   # Cette commande lit package.json et télécharge Express dans le dossier node_modules
   npm install
   ```

2. **Lancer l'application :**
   ```bash
   # Lance le script "start" défini dans package.json
   npm start
   ```
   Tu devrais voir : "Application démarrée sur http://localhost:3000"

3. **Tester dans le navigateur :**
   - Va sur http://localhost:3000
   - Tu devrais voir un JSON avec ton message "Hello Docker!"

4. **Arrêter l'app :**
   - Appuie sur `Ctrl+C` dans le terminal

**Pourquoi cette étape ?**
- Vérifier que ton code fonctionne avant de le dockeriser
- Comprendre ce que fait ton app
- Débugger plus facilement s'il y a un problème

**Structure finale de ton projet :**
```
mon-app-docker/
├── package.json          # Configuration du projet npm
├── app.js                # Code de ton serveur Express
├── Dockerfile            # Instructions pour Docker (vide pour l'instant)
└── node_modules/         # Dépendances installées (créé par npm install)
    └── express/          # Le framework Express et ses dépendances
```

**Note importante :** Le dossier `node_modules` contient toutes les bibliothèques. Il peut être très volumineux (plusieurs milliers de fichiers) mais c'est normal !

### Étape 2 : Écrire ton premier Dockerfile
Ton Dockerfile doit :
- Partir d'une image Node.js Alpine
- Définir `/app` comme répertoire de travail
- Copier tous les fichiers du projet
- Installer les dépendances npm
- Exposer le port 3000
- Lancer l'application avec `npm start`

### Étape 3 : Tester ton image
1. Build ton image avec le tag `mon-app:v1`
2. Lance un container sur le port 3000
3. Teste avec `curl http://localhost:3000`

**Questions :**
- Quelle est la taille de ton image ?
- Combien de temps a pris le build ?

<details>
<summary>🆘 Aide si tu es bloqué</summary>

**Structure attendue :**
```
mon-app-docker/
├── package.json
├── app.js
└── Dockerfile
```

**Commandes utiles :**
```bash
docker build -t mon-app:v1 .
docker run -p 3000:3000 mon-app:v1
docker images mon-app:v1
```
</details>

## Mission 2 : Découvrir le cache Docker

### Étape 1 : Expérimenter avec le cache
1. Rebuild ton image avec exactement la même commande
2. Observe les messages dans le terminal

**Questions :**
- Que remarques-tu dans les messages de build ?
- Combien de temps a pris ce deuxième build ?
- Pourquoi Docker affiche "Using cache" ?

### Étape 2 : Casser le cache
1. Modifie le message dans `app.js` (change "Hello Docker!" en autre chose)
2. Rebuild ton image avec le tag `mon-app:v2`
3. Observe attentivement les messages de build

**Questions :**
- À quelle étape le cache s'arrête-t-il d'être utilisé ?
- Pourquoi `npm install` se relance-t-il alors que `package.json` n'a pas changé ?
- Comment pourrait-on éviter cela ?

<details>
<summary>🆘 Aide pour comprendre</summary>

**Indices :**
- Docker compare le contenu des fichiers pour décider d'utiliser le cache
- Quand une étape change, toutes les étapes suivantes sont reconstruites
- L'ordre des instructions dans le Dockerfile est crucial
</details>

## Mission 3 : Optimiser le Dockerfile

### Défi : Éviter que npm install se relance
Tu as remarqué que `npm install` se relance à chaque modification de code. C'est un gaspillage de temps !

**Ton défi :** Réorganise ton Dockerfile pour que `npm install` utilise le cache même quand tu modifies `app.js`.

**Indices :**
- Réfléchis à l'ordre des instructions
- Quels fichiers changent souvent ? Lesquels changent rarement ?
- Copie d'abord ce qui change rarement

### Étape 1 : Créer un Dockerfile optimisé
1. Crée un nouveau Dockerfile qui copie `package.json` avant le reste
2. Build avec le tag `mon-app:v3`

### Étape 2 : Tester l'optimisation
1. Modifie encore le message dans `app.js`
2. Rebuild avec le tag `mon-app:v4`
3. Observe les messages de build

**Questions :**
- `npm install` utilise-t-il maintenant le cache ?
- Combien de temps économises-tu sur le build ?
- Pourquoi cette approche fonctionne-t-elle ?

<details>
<summary>🆘 Aide si tu es bloqué</summary>

**Principe clé :** Copie d'abord les fichiers qui changent rarement (package.json), puis les fichiers qui changent souvent (code source).

**Structure suggérée :**
1. FROM
2. WORKDIR  
3. COPY package.json
4. RUN npm install
5. COPY le reste
6. EXPOSE et CMD
</details>

## Mission 4 : Multi-stage builds

### Objectif : Réduire la taille de l'image
Actuellement, ton image contient potentiellement des dépendances de développement inutiles en production.

**Ton défi :** Crée un Dockerfile multi-stage qui sépare la phase de build de la phase de production.

### Étape 1 : Comprendre le concept
Un multi-stage build utilise plusieurs `FROM` dans le même Dockerfile :
- **Stage 1** : Environnement de build (avec toutes les dépendances)
- **Stage 2** : Environnement de production (minimal)

### Étape 2 : Créer le Dockerfile multi-stage
Ton Dockerfile doit avoir :
1. **Premier stage** nommé "builder" :
   - Installe toutes les dépendances
   - Copie tout le code
2. **Deuxième stage** pour la production :
   - Installe seulement les dépendances de production (`npm ci --only=production`)
   - Copie le code depuis le stage builder
   - Ajoute un utilisateur non-root pour la sécurité

### Étape 3 : Comparer les résultats
1. Build ton image multi-stage avec le tag `mon-app:multi-stage`
2. Compare les tailles avec `docker images | grep mon-app`

**Questions :**
- Quelle est la différence de taille entre tes images ?
- Pourquoi l'image multi-stage est-elle plus petite ?
- Quels sont les autres avantages du multi-stage ?

<details>
<summary>🆘 Aide pour le multi-stage</summary>

**Structure suggérée :**
```dockerfile
# Stage 1
FROM node:18-alpine AS builder
# ... instructions de build

# Stage 2  
FROM node:18-alpine AS production
# ... copie depuis le stage builder
COPY --from=builder /app/quelque-chose .
```

**Commande pour créer un utilisateur :**
```dockerfile
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001 -G nodejs
USER appuser
```
</details>

## Mission 5 : Optimiser avec .dockerignore

### Problème : Contexte de build trop lourd
Docker envoie TOUS les fichiers du répertoire au daemon Docker. Cela peut ralentir le build.

### Étape 1 : Créer des fichiers inutiles
1. Crée un dossier `temp` avec des gros fichiers dedans
2. Crée un `README.md` avec de la documentation
3. Assure-toi d'avoir un dossier `node_modules` (après npm install)

### Étape 2 : Mesurer l'impact
1. Build ton image et observe le message "Sending build context to Docker daemon"
2. Note la taille du contexte

### Étape 3 : Créer un .dockerignore
Crée un fichier `.dockerignore` qui exclut :
- node_modules
- temp/
- README.md
- .git
- Autres fichiers inutiles

### Étape 4 : Comparer
1. Rebuild ton image
2. Compare la taille du contexte de build

**Questions :**
- Quelle différence de taille observes-tu ?
- Pourquoi exclure `node_modules` alors qu'on fait `npm install` dans le Dockerfile ?

## Mission 6 : Analyser tes images

### Étape 1 : Explorer les layers
Utilise ces commandes pour analyser tes images :
- `docker history mon-app:multi-stage`
- `docker inspect mon-app:multi-stage`

### Étape 2 : Comparer tes différentes versions
Compare toutes tes images créées pendant ce TP :
- `docker images | grep mon-app`

**Questions :**
- Combien de layers a ton image multi-stage ?
- Quelle est ta plus grosse image ? La plus petite ?
- Peux-tu identifier quelles instructions créent les plus gros layers ?

## Mission Bonus : Défis avancés

### Défi 1 : Image ultra-légère
Essaie de créer une image de moins de 30MB. Indices :
- Supprime le cache npm après installation
- Utilise `npm ci` au lieu de `npm install`
- Nettoie les fichiers temporaires

### Défi 2 : Healthcheck
Ajoute un `HEALTHCHECK` à ton Dockerfile qui vérifie que ton API répond.

### Défi 3 : Build conditionnel
Utilise des `ARG` pour créer un Dockerfile qui build différemment selon l'environnement (dev/prod).

<details>
<summary>🆘 Aide pour les défis</summary>

**Défi 1 - Nettoyage :**
```dockerfile
RUN npm ci --only=production && npm cache clean --force
```

**Défi 2 - Healthcheck :**
```dockerfile
HEALTHCHECK --interval=30s CMD wget --spider http://localhost:3000/ || exit 1
```

**Défi 3 - ARG :**
```dockerfile
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ] ; then npm install ; else npm ci --only=production ; fi
```
</details>

## Bilan de ton TP

### Ce que tu as appris
- ✅ Créer un Dockerfile fonctionnel
- ✅ Comprendre le système de cache Docker
- ✅ Optimiser l'ordre des instructions
- ✅ Utiliser les multi-stage builds
- ✅ Réduire la taille des images
- ✅ Utiliser .dockerignore efficacement
- ✅ Analyser et débugger tes images

### Questions de validation
Peux-tu répondre à ces questions ?
1. Pourquoi copier `package.json` avant le code source ?
2. Quelle est la différence entre `npm install` et `npm ci` ?
3. Pourquoi utiliser un utilisateur non-root en production ?
4. Comment fonctionne le cache des layers Docker ?
5. Quand utiliser multi-stage vs single-stage builds ?

### Prochaines étapes
Maintenant que tu maîtrises les Dockerfiles, tu peux :
- Faire l'[exercice 5 sur le CI/CD](./docker-exercice-5.md)
- Passer au [cours Docker Compose](../cours/DOCKER-COURS-2.md)
- Essayer de containeriser tes propres projets
- Explorer les registries Docker (DockerHub, GitHub Container Registry)
- Apprendre les bonnes pratiques de sécurité Docker

### Ressources pour aller plus loin
- [Documentation officielle Dockerfile](https://docs.docker.com/engine/reference/builder/)
- [Best practices Docker](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage builds](https://docs.docker.com/develop/dev-best-practices/#use-multi-stage-builds)
