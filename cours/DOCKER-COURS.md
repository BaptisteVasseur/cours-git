# Cours complet : Maîtriser Docker et la containerisation

Bienvenu dans le monde fascinant de Docker ! Ce cours va bien au-delà d'un simple TP. Tu vas comprendre **pourquoi** Docker révolutionne le développement, **comment** il fonctionne sous le capot, et **quand** l'utiliser dans tes projets.

## Objectifs du cours

À la fin de ce cours, tu seras capable de :
- **Comprendre** les concepts fondamentaux de la containerisation
- **Expliquer** la différence entre containers et machines virtuelles
- **Créer** et gérer des containers pour tes applications
- **Écrire** des Dockerfiles optimisés et sécurisés
- **Orchestrer** des applications multi-containers
- **Débugger** et résoudre les problèmes courants
- **Appliquer** les bonnes pratiques en production

## Comprendre la containerisation

### Le problème que Docker résout

Imagine cette situation classique :
- Ton code marche sur ta machine 
- Il ne marche pas sur celle de ton collègue 
- Il ne marche pas en production 
- "Mais ça marche sur ma machine !"

**Docker résout ce problème** en empaquetant TOUT ce dont ton app a besoin.

### Containers vs Machines Virtuelles

#### Machine Virtuelle traditionnelle
```
┌─────────────────────────────────────┐
│           Application               │
├─────────────────────────────────────┤
│          OS Complet (GB)            │
├─────────────────────────────────────┤
│          Hyperviseur                │
├─────────────────────────────────────┤
│          OS Hôte                    │
└─────────────────────────────────────┘
```

#### Container Docker
```
┌─────────────────────────────────────┐
│           Application               │
├─────────────────────────────────────┤
│         Docker Engine               │
├─────────────────────────────────────┤
│          OS Hôte                    │
└─────────────────────────────────────┘
```

### Les concepts fondamentaux

#### Container
Un **environnement d'exécution isolé** qui contient :
- **Ton application** et son code
- **Les dépendances** (Node.js, Python, etc.)
- **Les bibliothèques système** nécessaires
- **Les variables d'environnement**
- **La configuration réseau**

#### Image Docker
Un **template en lecture seule** qui contient :
- Le système de fichiers de base
- Les instructions pour construire le container
- Les métadonnées (ports, variables, etc.)

**Analogie :** Si l'image est une "recette de cuisine", le container est le "plat cuisiné".

#### Dockerfile
Un **fichier de configuration** qui décrit :
- Quelle image de base utiliser
- Quels fichiers copier
- Quelles commandes exécuter
- Comment configurer l'environnement

### Pourquoi Docker révolutionne le développement

#### Portabilité
- **Même environnement** partout (dev, test, prod)
- **Fini les "ça marche sur ma machine"**
- **Déploiement simplifié** sur n'importe quel serveur

#### Performance
- **Démarrage rapide** (secondes vs minutes pour les VMs)
- **Moins de ressources** consommées
- **Partage du kernel** de l'OS hôte

#### Isolation
- **Chaque app dans son sandbox**
- **Pas de conflits** entre dépendances
- **Sécurité renforcée**

#### Packaging
- **Une seule unité de déploiement**
- **Versioning des environnements**
- **Rollback facile** en cas de problème

## Installation de Docker

### Windows
Pas de solution alternative ici, il faut passer par **Docker Desktop** (désolé, pas le choix)

### MacOS
Tu as le choix entre :
- **Docker Desktop** (le classique)
- **OrbStack** (plus léger et plus rapide)

### Linux
Félicitations, tu as le vrai OS ! 
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Ajoute ton utilisateur au groupe docker
sudo usermod -aG docker $USER
```

 **Important** : Lis bien les instructions d'installation sur la doc officielle de Docker : https://docs.docker.com/desktop/

### Test de l'installation

Une fois installé, teste avec cette commande magique :
```bash
docker run hello-world
```

Si ça marche, Docker te dira bonjour ! Si ça ne marche pas... eh bien, retourne lire la doc 😅

## Le cycle de vie d'un container

### Comprendre les états d'un container

```
  docker run     docker stop     docker rm
Created ──────► Running ──────► Stopped ──────► Deleted
   │                │              │
   │                │              │
   └─── docker start ──────────────┘
```

### Workflow Docker typique

1. **Développement** : Écrire le Dockerfile
2. **Build** : Construire l'image (`docker build`)
3. **Run** : Lancer le container (`docker run`)
4. **Test** : Vérifier que tout fonctionne
5. **Debug** : Utiliser `docker logs` et `docker exec`
6. **Deploy** : Pousser l'image vers un registry

### Commandes essentielles expliquées

#### Gestion des images

```bash
# Voir toutes les images locales
docker images
# Résultat : liste avec REPOSITORY, TAG, IMAGE ID, CREATED, SIZE

# Télécharger une image depuis Docker Hub
docker pull nginx:latest
# Ce qui se passe : Docker télécharge les layers de l'image
# Les layers sont des couches empilées qui composent l'image
# Chaque instruction du Dockerfile crée une nouvelle layer
# Docker peut réutiliser les layers communes entre différentes images

# Construire une image depuis un Dockerfile
docker build -t mon-app:v1.0 .
# -t : donne un nom et tag à l'image
# . : utilise le Dockerfile du répertoire courant

# Supprimer une image
docker rmi nginx:latest
# Attention : impossible si un container l'utilise encore
```

#### Gestion des containers

```bash
# Lancer un container (mode interactif)
docker run -it ubuntu:latest bash
# -i : garde STDIN ouvert (permet d'envoyer des commandes au container)
# -t : alloue un pseudo-TTY (terminal virtuel pour affichage correct)
# STDIN = flux d'entrée standard (ce que tu tapes au clavier)
# TTY = interface terminal qui gère l'affichage, les couleurs, etc.
# Résultat : tu te retrouves dans le shell du container comme si tu étais connecté en SSH

# Lancer en arrière-plan (daemon)
docker run -d nginx:latest
# -d : detached mode (détaché du terminal)
# Le container tourne en arrière-plan, tu récupères la main sur ton terminal
# Utile pour les services (serveurs web, bases de données, etc.)
# Résultat : retourne l'ID du container et tu peux continuer à utiliser ton terminal

# Mapping de ports
docker run -p 8080:80 nginx:latest
# 8080 : port sur ton ordinateur
# 80 : port dans le container
# Résultat : http://localhost:8080 → container

# Voir les containers actifs
docker ps
# Affiche les containers en cours d'exécution avec leurs infos principales

# Voir TOUS les containers (même arrêtés)
docker ps -a
# Utile pour voir l'historique et débugger les containers qui ont planté

# Arrêter proprement un container
docker stop mon-container
# Envoie SIGTERM puis SIGKILL après 10s
# SIGTERM = signal "termine-toi proprement" (l'app peut sauvegarder, fermer les connexions)
# SIGKILL = signal "arrêt forcé immédiat" (tue le processus brutalement)
# Docker laisse 10 secondes à l'app pour se terminer proprement avant de forcer

# Forcer l'arrêt
docker kill mon-container
# Envoie directement SIGKILL

# Supprimer un container arrêté
docker rm mon-container
# Libère l'espace disque

# Voir les logs d'un container
docker logs mon-container
# -f : suivre les logs en temps réel
# --tail 100 : voir seulement les 100 dernières lignes

# Entrer dans un container qui tourne
docker exec -it mon-container bash
# Ouvre un nouveau shell dans le container existant
```

#### Commandes de debug

```bash
# Inspecter un container en détail
docker inspect mon-container
# Retourne toute la configuration en JSON

# Voir les processus dans un container
docker top mon-container
# Équivalent de 'ps' mais pour le container

# Statistiques en temps réel
docker stats
# CPU, mémoire, réseau, I/O de tous les containers

# Copier des fichiers
docker cp fichier.txt mon-container:/tmp/
docker cp mon-container:/tmp/fichier.txt ./
# Bidirectionnel entre host et container
```

## Exercices pratiques Docker

### Liste des exercices

Les exercices sont maintenant dans des fichiers séparés pour une meilleure organisation :

1. **[Exercice 1 : Container Node.js](../exercices/docker-exercice-1.md)**
   - Découvrir les bases de Docker avec Node.js
   - Copier et exécuter des fichiers dans un container
   - Comprendre l'isolation des containers

2. **[Exercice 2 : Container Alpine Linux](../exercices/docker-exercice-2.md)**
   - Explorer un système Linux minimal
   - Comprendre la persistance (ou son absence !)
   - Installer des paquets et voir ce qui arrive
   - Docker dans Docker (Inception style 🎬)

3. **[Exercice 3 : Container PHP](../exercices/docker-exercice-3.md)**
   - Utiliser PHP et son serveur web intégré
   - Mapper des ports pour accéder depuis le navigateur
   - Servir du contenu web depuis un container

4. **[Exercice 4 : Maîtriser les Dockerfiles](../exercices/docker-exercice-4.md)**
   - Créer et optimiser des Dockerfiles
   - Comprendre le système de cache des layers
   - Multi-stage builds et réduction de taille d'images

5. **[Exercice 5 : CI/CD avec GitHub Actions et Vercel](../exercices/docker-exercice-5.md)**
   - Pipeline CI/CD complet avec tests automatisés
   - Déploiement automatique sur Vercel
   - Gestion des environnements et secrets

### Conseils pour les exercices

- Chaque exercice contient des **spoilers** avec les commandes exactes
- N'hésite pas à expérimenter au-delà des instructions
- Les erreurs font partie de l'apprentissage !
- Utilise `docker ps` et `docker logs` pour débugger

## Créer ses propres images avec Dockerfile

### Anatomie d'un Dockerfile

Un Dockerfile est comme une **recette de cuisine** pour construire une image. Chaque instruction crée une nouvelle **layer** (couche).

#### Structure type d'un Dockerfile

```dockerfile
# 1. Image de base
FROM node:18-alpine

# 2. Métadonnées
LABEL maintainer="ton-email@example.com"
LABEL version="1.0"

# 3. Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# 4. Répertoire de travail dans l'image docker
WORKDIR /app

# 5. Copier les dépendances d'abord (pour le cache)
COPY package*.json ./

# 6. Installer les dépendances
RUN npm ci --only=production

# 7. Copier le code source
COPY . .

# 8. Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 9. Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# 10. Exposer le port
EXPOSE 3000

# 11. Vérification de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 12. Commande par défaut
CMD ["npm", "start"]
```

### Instructions Dockerfile expliquées

#### FROM - L'image de base
```dockerfile
FROM node:18-alpine
# Utilise Node.js version 18 sur Alpine Linux (très léger)

FROM ubuntu:22.04
# Utilise Ubuntu 22.04 (plus lourd mais plus complet)

FROM scratch
# Image vide (pour les binaires statiques)
```

#### WORKDIR - Répertoire de travail
```dockerfile
WORKDIR /app
# Équivalent à 'cd /app' + création du dossier si inexistant
# Toutes les commandes suivantes s'exécutent dans ce répertoire, alors qu'avec cd il faut le faire à chaque commande
```

#### COPY vs ADD
```dockerfile
# COPY : simple copie de fichiers dans l'image
COPY package.json ./
COPY src/ ./src/

# ADD : copie + fonctionnalités avancées (décompression, URL)
ADD https://example.com/file.tar.gz /tmp/
# Évite ADD sauf cas spécifiques
```

#### RUN - Exécuter des commandes
```dockerfile
# Une commande par RUN (crée une layer par commande)
RUN apt-get update
RUN apt-get install -y curl

# Mieux : combiner les commandes (une seule layer)
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
```

#### ENV - Variables d'environnement
```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgres://localhost/mydb

# Utilisables dans le Dockerfile et le container
RUN echo "Environment: $NODE_ENV"
```

On peux bien evidemment personnaliser les variables d'environnement pendant le build de l'image avec des arguments (par exemple build en mode prod ou en mode dev)

#### EXPOSE - Documenter les ports
```dockerfile
EXPOSE 3000
EXPOSE 8080 8443

# ⚠️ N'ouvre PAS les ports ! Juste de la documentation
# Utilise -p lors du docker run pour mapper les ports
```

#### CMD vs ENTRYPOINT
```dockerfile
# CMD : commande par défaut (peut être overridée)
CMD ["npm", "start"]
# docker run mon-image        → exécute npm start
# docker run mon-image bash   → exécute bash

# ENTRYPOINT : point d'entrée fixe
ENTRYPOINT ["npm"]
CMD ["start"]
# docker run mon-image        → exécute npm start
# docker run mon-image test   → exécute npm test
```

### Optimisation des Dockerfiles

#### 1. Comprendre le système de cache des layers

Docker utilise un **système de cache intelligent** basé sur les layers :

**Comment ça fonctionne :**
- Chaque instruction Dockerfile crée une nouvelle layer
- Docker calcule un hash pour chaque layer basé sur son contenu
- Si le hash n'a pas changé, Docker réutilise la layer du cache
- Dès qu'une layer change, toutes les layers suivantes sont reconstruites

**Exemple concret :**
```dockerfile
FROM node:18-alpine        # Layer 1: Cache HIT (image de base inchangée)
WORKDIR /app              # Layer 2: Cache HIT (instruction identique)
COPY package.json ./      # Layer 3: Cache HIT (fichier inchangé)
RUN npm install           # Layer 4: Cache HIT (dépendances inchangées)
COPY . .                  # Layer 5: Cache MISS (code modifié)
RUN npm run build         # Layer 6: Rebuild (layer précédente changée)
```

#### 2. Ordre optimal des instructions (du moins changeant au plus changeant)
```dockerfile
# ❌ Mauvais : le cache est cassé à chaque modification de code
FROM node:18-alpine
COPY . .
RUN npm install

# ✅ Bon : le cache des dépendances est préservé
FROM node:18-alpine
COPY package*.json ./
RUN npm install
COPY . .
```

#### 3. Multi-stage builds : Pourquoi et comment

**Le problème :** Une image contient souvent des outils de build inutiles en production
- Compilateurs, outils de développement, dépendances de build
- Fichiers sources, tests, documentation
- Résultat : images lourdes et moins sécurisées

**La solution :** Séparer le build de la production

**Avantages :**
- **Taille réduite** : Image finale contient seulement le nécessaire
- **Sécurité** : Pas d'outils de développement en production
- **Performance** : Déploiement plus rapide
- **Propreté** : Séparation claire des responsabilités

**Exemple concret :**
```dockerfile
# Stage 1 : Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 : Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
CMD ["npm", "start"]
```

#### 4. .dockerignore : Optimiser le contexte de build

**Le problème :** Docker envoie TOUT le répertoire au daemon Docker lors du build
- Fichiers inutiles ralentissent le build
- Augmente la taille du contexte de build
- Peut exposer des fichiers sensibles

**La solution :** Exclure les fichiers non nécessaires

**Impact sur les performances :**
```bash
# Sans .dockerignore
Sending build context to Docker daemon  2.5GB
# Avec .dockerignore optimisé  
Sending build context to Docker daemon  15MB
```

**Fichiers à toujours exclure :**
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
Thumbs.db
```

### Exemple pratique : Dockerfile pour notre projet

```dockerfile
# Image de base légère avec Node.js
FROM node:18-alpine

# Métadonnées
LABEL maintainer="baptiste@example.com"
LABEL description="Convertisseur emoji"

# Variables d'environnement
ENV NODE_ENV=production

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY code/ ./code/

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

# Utiliser l'utilisateur non-root
USER appuser

# Commande par défaut
CMD ["node", "code/main.js"]
```

### Construire et tester l'image

```bash
# Construire l'image
docker build -t emoji-converter:latest .

# Tester l'image
docker run --rm emoji-converter:latest

# Version avec tag spécifique
docker build -t emoji-converter:v1.0 .

# Voir l'historique des layers
docker history emoji-converter:latest

# Analyser la taille de l'image
docker images emoji-converter
```


## Questions souvent posées par les recruteurs

Prépare-toi aux entretiens techniques avec ces questions classiques sur Docker :

### Questions de base

1. **"Quelle est la différence entre une image et un container Docker ?"**
   - *Réponse attendue :* Une image est un template/modèle statique, un container est une instance en cours d'exécution de cette image.

2. **"Pourquoi utiliser Docker plutôt qu'une machine virtuelle ?"**
   - *Points clés :* Légèreté, rapidité de démarrage, partage du kernel, moins de ressources consommées.

3. **"Qu'est-ce qu'un Dockerfile et à quoi sert-il ?"**
   - *Réponse attendue :* Un fichier de configuration qui décrit comment construire une image Docker étape par étape.

### Questions intermédiaires

4. **"Comment gérer la persistance des données dans Docker ?"**
   - *Concepts à mentionner :* Volumes, bind mounts, tmpfs mounts.

5. **"Expliquez le concept de 'layers' dans Docker"**
   - *Points clés :* Système de couches, cache, optimisation des builds, partage entre images.

6. **"Quelle est la différence entre CMD et ENTRYPOINT dans un Dockerfile ?"**
   - *Réponse attendue :* CMD peut être overridé, ENTRYPOINT est toujours exécuté.

### Questions avancées

7. **"Comment optimiseriez-vous la taille d'une image Docker ?"**
   - *Techniques :* Multi-stage builds, images Alpine, .dockerignore, nettoyage des caches.

8. **"Qu'est-ce que Docker Compose et quand l'utiliser ?"**
   - *Réponse attendue :* Orchestration multi-containers, environnements de développement, définition de stacks.

9. **"Comment débugger un container qui ne démarre pas ?"**
   - *Outils :* docker logs, docker exec, docker inspect, mode interactif.

10. **"Quelles sont les bonnes pratiques de sécurité avec Docker ?"**
    - *Points clés :* Utilisateur non-root, images officielles, scan de vulnérabilités, secrets management.

### Conseil pour les entretiens

N'hésite pas à mentionner tes expériences pratiques avec les exercices de ce cours ! Les recruteurs apprécient les exemples concrets.

---
*Créé par Baptiste VASSEUR*
