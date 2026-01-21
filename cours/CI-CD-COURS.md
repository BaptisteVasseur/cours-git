# Docker Avancé : Dockerfile, Compose et CI/CD

## Partie 1 : Docker Compose

### Qu'est-ce que Docker Compose ?

Docker Compose permet de **définir et orchestrer des applications multi-containers** avec un simple fichier YAML.

#### Problème résolu
```bash
# Sans Compose : commandes multiples et complexes
docker network create myapp-network
docker run -d --name redis --network myapp-network redis:alpine
docker run -d --name db --network myapp-network -e POSTGRES_PASSWORD=secret postgres:13
docker run -d --name app --network myapp-network -p 3000:3000 -e DATABASE_URL=postgres://db:5432/myapp myapp:latest

# Avec Compose : une seule commande
docker compose up
```

### Structure d'un docker-compose.yml

```yaml
version: '3.8'

# Définition des services (containers)
services:
  # Service de base de données
  database:
    image: postgres:13-alpine
    container_name: myapp_db
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret123
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d myapp"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Service de cache
  redis:
    image: redis:7-alpine
    container_name: myapp_redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - backend
    restart: unless-stopped

  # Service application
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    container_name: myapp_web
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://admin:secret123@database:5432/myapp
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    volumes:
      - ./uploads:/app/uploads
    networks:
      - frontend
      - backend
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  # Service reverse proxy
  nginx:
    image: nginx:alpine
    container_name: myapp_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - frontend
    depends_on:
      - app
    restart: unless-stopped

# Définition des réseaux
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # Réseau interne (pas d'accès internet)

# Définition des volumes persistants
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

### Commandes Docker Compose essentielles

```bash
# Démarrer tous les services
docker compose up
docker compose up -d                    # En arrière-plan
docker compose up --build               # Rebuild les images
docker compose up --scale app=3         # Scaler le service app

# Arrêter les services
docker compose down                     # Arrêter et supprimer
docker compose down -v                  # + supprimer les volumes
docker compose stop                     # Juste arrêter

# Gestion des services
docker compose ps                       # État des services
docker compose logs                     # Logs de tous les services
docker compose logs -f app              # Suivre les logs du service app
docker compose exec app bash            # Shell dans le container app
docker compose restart app              # Redémarrer le service app

# Build et images
docker compose build                    # Builder toutes les images
docker compose build app               # Builder seulement le service app
docker compose pull                     # Mettre à jour les images

# Nettoyage
docker compose down --rmi all           # Supprimer aussi les images
docker system prune -f                  # Nettoyage général Docker
```

### Environnements multiples

#### Structure des fichiers
```
project/
├── docker-compose.yml          # Configuration de base
├── docker-compose.dev.yml      # Surcharges pour le développement
├── docker-compose.prod.yml     # Surcharges pour la production
├── .env                        # Variables d'environnement par défaut
├── .env.dev                    # Variables pour le développement
└── .env.prod                   # Variables pour la production
```

#### docker-compose.yml (base)
```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      NODE_ENV: ${NODE_ENV}
      DATABASE_URL: ${DATABASE_URL}
    ports:
      - "${APP_PORT}:3000"
```

#### docker-compose.dev.yml (développement)
```yaml
version: '3.8'
services:
  app:
    build:
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
    command: npm run dev
```

#### Utilisation (plusieurs fichiers compose.yml)
```bash
# Développement
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Partie 2 : CI/CD avec GitHub Actions

### Introduction au CI/CD pour débutants

#### Qu'est-ce que le CI/CD ?

**CI/CD** = **Continuous Integration** / **Continuous Deployment**

**Problème sans CI/CD :**
- Tu développes sur ta machine
- Tu testes manuellement
- Tu déploies à la main sur le serveur
- Si ça casse, tu découvres le problème en production
- Stress et nuits blanches garanties ! 😰

**Solution avec CI/CD :**
- À chaque modification de code, des robots s'occupent de tout
- Tests automatiques
- Build automatique
- Déploiement automatique
- Tu dors tranquille !

#### Workflow étape par étape

```
1. Tu push ton code sur GitHub
         ↓
2. GitHub Actions détecte le changement
         ↓
3. Robot lance les tests automatiquement
         ↓
4. Si tests OK → Robot build l'image Docker
         ↓
5. Robot pousse l'image sur un registry
         ↓
6. Robot déploie sur le serveur de production
         ↓
7. Ton app est en ligne avec la nouvelle version !
```

### Comprendre GitHub Actions

#### C'est quoi GitHub Actions ?

GitHub Actions = **robots qui exécutent des tâches** quand quelque chose se passe dans ton repo.

**Concepts clés :**
- **Workflow** : Une suite de tâches à exécuter
- **Job** : Un groupe de tâches qui s'exécutent sur la même machine
- **Step** : Une tâche individuelle (lancer des tests, build Docker, etc.)
- **Runner** : La machine virtuelle qui exécute tes jobs

#### Structure d'un workflow

```
Workflow "CI Pipeline"
├── Job "Tests"
│   ├── Step "Checkout code"
│   ├── Step "Install dependencies"
│   └── Step "Run tests"
├── Job "Build Docker"
│   ├── Step "Build image"
│   └── Step "Push to registry"
└── Job "Deploy"
    └── Step "Deploy to production"
```

### GitHub Actions pour Docker

#### Structure des fichiers
```
.github/
└── workflows/
    ├── ci.yml              # Tests et validation
    ├── build.yml           # Build et push des images
    └── deploy.yml          # Déploiement en production
```

#### Décortiquer un workflow GitHub Actions

Prenons un exemple concret et expliquons chaque partie :

##### 1. Configuration de base

```yaml
name: CI Pipeline  # Nom du workflow (affiché dans GitHub)

# Quand déclencher ce workflow ?
on:
  push:
    branches: [ main, develop ]  # À chaque push sur main ou develop
  pull_request:
    branches: [ main ]           # À chaque pull request vers main

# Variables globales utilisables dans tous les jobs
env:
  NODE_VERSION: '18'                    # Version de Node.js à utiliser
  DOCKER_REGISTRY: ghcr.io             # Où stocker nos images Docker
  IMAGE_NAME: ${{ github.repository }}  # Nom de l'image (ex: monuser/monapp)
```

##### 2. Job 1 : Tests automatiques

```yaml

jobs:
  # ================================
  # JOB 1 : TESTS AUTOMATIQUES
  # ================================
  test:
    runs-on: ubuntu-latest  # Machine virtuelle Ubuntu
    
    # Services annexes (base de données pour les tests)
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready      # Commande pour vérifier si PostgreSQL est prêt
          --health-interval 10s        # Vérifier toutes les 10 secondes
          --health-timeout 5s          # Timeout de 5 secondes
          --health-retries 5           # 5 tentatives maximum
        ports:
          - 5432:5432                  # Exposer PostgreSQL sur le port 5432

    steps:
    # Étape 1 : Récupérer le code source
    - name: Checkout code
      uses: actions/checkout@v4      # Action pré-faite pour télécharger le repo

    # Étape 2 : Installer Node.js
    - name: Setup Node.js
      uses: actions/setup-node@v4    # Action pré-faite pour installer Node.js
      with:
        node-version: ${{ env.NODE_VERSION }}  # Utilise la variable NODE_VERSION
        cache: 'npm'                 # Cache automatique des dépendances npm

    # Étape 3 : Installer les dépendances
    - name: Install dependencies
      run: npm ci                    # npm ci = version rapide et déterministe de npm install

    # Étape 4 : Vérifier la qualité du code
    - name: Run linter
      run: npm run lint              # Vérifie le style et les erreurs de code

    # Étape 5 : Lancer les tests
    - name: Run tests
      run: npm test
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db  # URL de la DB de test

    # Étape 6 : Envoyer les résultats de couverture
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info   # Fichier généré par les tests

  # ================================
  # JOB 2 : BUILD DOCKER ET SÉCURITÉ
  # ================================
  build:
    runs-on: ubuntu-latest
    needs: test                      # Ce job attend que le job "test" soit terminé avec succès
    
    steps:
    # Étape 1 : Récupérer le code
    - name: Checkout code
      uses: actions/checkout@v4

    # Étape 2 : Configurer Docker Buildx (pour build multi-architecture)
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3  # Permet de build pour AMD64 et ARM64

    # Étape 3 : Se connecter au registry Docker
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.DOCKER_REGISTRY }}    # ghcr.io (GitHub Container Registry)
        username: ${{ github.actor }}           # Ton nom d'utilisateur GitHub
        password: ${{ secrets.GITHUB_TOKEN }}   # Token automatique fourni par GitHub

    # Étape 4 : Générer les tags et métadonnées
    - name: Extract metadata
      id: meta                       # ID pour référencer les outputs de cette étape
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch      # Tag avec le nom de la branche (ex: main, develop)
          type=ref,event=pr          # Tag avec le numéro de PR (ex: pr-123)
          type=sha,prefix={{branch}}- # Tag avec le hash du commit (ex: main-abc1234)
          type=raw,value=latest,enable={{is_default_branch}}  # Tag "latest" seulement sur la branche principale

    # Étape 5 : Builder et pousser l'image Docker
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .                   # Utilise le répertoire courant comme contexte
        platforms: linux/amd64,linux/arm64  # Build pour Intel et ARM (M1/M2 Mac)
        push: true                   # Pousse l'image vers le registry
        tags: ${{ steps.meta.outputs.tags }}     # Utilise les tags générés à l'étape précédente
        labels: ${{ steps.meta.outputs.labels }} # Ajoute des métadonnées à l'image
        cache-from: type=gha         # Utilise le cache GitHub Actions (plus rapide)
        cache-to: type=gha,mode=max  # Sauvegarde le cache pour les prochains builds

    # Étape 6 : Scanner l'image pour les vulnérabilités
    - name: Run security scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAME }}:latest
        format: 'sarif'              # Format de sortie pour GitHub Security
        output: 'trivy-results.sarif'

    # Étape 7 : Uploader les résultats de sécurité
    - name: Upload security scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'  # Affiche les vulnérabilités dans l'onglet Security

  # ================================
  # JOB 3 : DÉPLOIEMENT EN PRODUCTION
  # ================================
  deploy:
    runs-on: ubuntu-latest
    needs: [test, build]             # Attend que les tests ET le build soient OK
    if: github.ref == 'refs/heads/main'  # Seulement sur la branche main
    environment: production          # Environnement protégé (peut nécessiter une approbation)
    
    steps:
    # Étape 1 : Se connecter au serveur et déployer
    - name: Deploy to production
      uses: appleboy/ssh-action@v1.0.0  # Action pour exécuter des commandes SSH
      with:
        host: ${{ secrets.PROD_HOST }}      # IP du serveur (stocké dans les secrets GitHub)
        username: ${{ secrets.PROD_USER }}  # Nom d'utilisateur SSH
        key: ${{ secrets.PROD_SSH_KEY }}    # Clé privée SSH
        script: |
          cd /opt/myapp                     # Aller dans le dossier de l'app
          docker compose pull               # Télécharger les nouvelles images
          docker compose up -d              # Redémarrer les services en arrière-plan
          docker system prune -f           # Nettoyer les anciennes images
```

#### Comprendre le flux complet

**Ce qui se passe quand tu push du code :**

1. **Déclenchement** : GitHub détecte ton push
2. **Job Tests** : 
   - Démarre une machine Ubuntu
   - Lance PostgreSQL pour les tests
   - Installe Node.js et les dépendances
   - Vérifie la qualité du code (linter)
   - Lance tous les tests
3. **Job Build** (si tests OK) :
   - Démarre une nouvelle machine Ubuntu
   - Configure Docker pour multi-architecture
   - Se connecte au registry GitHub
   - Build l'image Docker pour AMD64 et ARM64
   - Pousse l'image vers le registry
   - Scanne l'image pour les vulnérabilités
4. **Job Deploy** (si build OK et branche = main) :
   - Se connecte en SSH au serveur de production
   - Télécharge la nouvelle image
   - Redémarre l'application
   - Nettoie les anciennes images

**Temps total :** Environ 5-10 minutes selon la complexité

#### Gestion des secrets

Les **secrets** sont des informations sensibles stockées de manière sécurisée dans GitHub :

```yaml
# Dans GitHub Settings > Secrets and variables > Actions
PROD_HOST: 192.168.1.100          # IP du serveur
PROD_USER: deploy                 # Utilisateur SSH
PROD_SSH_KEY: -----BEGIN PRIVATE KEY-----  # Clé privée SSH
DATABASE_URL: postgres://...      # URL de la base de données
API_KEY: sk-1234567890           # Clés d'API tierces
```

**Pourquoi utiliser des secrets ?**
- Les mots de passe ne sont jamais visibles dans le code
- Accès restreint aux collaborateurs autorisés
- Chiffrement automatique par GitHub

### Bonnes pratiques CI/CD

#### 1. Gestion des secrets
```yaml
# Dans GitHub Settings > Secrets
DOCKER_USERNAME: your-dockerhub-username
DOCKER_PASSWORD: your-dockerhub-token
PROD_HOST: your-server-ip
PROD_SSH_KEY: your-private-ssh-key
DATABASE_URL: postgres://user:pass@host:port/db
```

#### 2. Stratégies de déploiement

##### Blue-Green Deployment : Déploiement sans interruption

**Le problème du déploiement classique :**
```
Version 1 en production → Arrêt → Déploiement Version 2 → Redémarrage
                           ↑
                    Interruption de service !
```

**La solution Blue-Green :**
```
Blue (Version 1)     Green (Version 2)
     ↓                      ↓
Production active    Nouvelle version en test
     ↓                      ↓
Trafic 100% → Blue   Trafic 0% → Green
     ↓                      ↓
Tests OK sur Green ? → Basculement instantané
     ↓                      ↓
Trafic 0% → Blue     Trafic 100% → Green
     ↓                      ↓
Arrêt de Blue        Green devient la production
```

**Avantages :**
- **Zéro interruption** : Le basculement est instantané
- **Rollback rapide** : En cas de problème, on rebascule vers Blue
- **Tests en conditions réelles** : Green reçoit le même environnement que Blue
- **Sécurité** : L'ancienne version reste disponible

**Exemple concret avec Docker :**

```yaml
# Blue-Green Deployment
- name: Blue-Green Deploy
  run: |
    # 1. Déployer la nouvelle version (Green) en parallèle
    docker compose -f docker-compose.green.yml up -d
    
    # 2. Attendre que Green soit prêt
    sleep 30
    
    # 3. Vérifier la santé de Green
    ./health-check.sh green
    
    # 4. Si Green est OK → Basculer le trafic (load balancer/proxy)
    ./switch-traffic.sh green
    
    # 5. Vérifier que le trafic fonctionne sur Green
    ./verify-traffic.sh green
    
    # 6. Si tout est OK → Arrêter Blue
    docker compose -f docker-compose.blue.yml down
    
    # 7. Green devient le nouveau Blue pour le prochain déploiement
    mv docker-compose.green.yml docker-compose.blue.yml
```

**Structure des fichiers :**
```
project/
├── docker-compose.blue.yml    # Version actuellement en production
├── docker-compose.green.yml   # Nouvelle version à déployer
├── nginx.conf                 # Configuration du load balancer
├── health-check.sh           # Script de vérification
└── switch-traffic.sh         # Script de basculement
```

**Configuration nginx pour Blue-Green :**
```nginx
upstream backend {
    # Initialement tout le trafic va vers Blue
    server blue-app:3000 weight=100;
    server green-app:3000 weight=0;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

**Autres stratégies de déploiement :**

- **Rolling Update** : Remplacement progressif des instances
- **Canary Deployment** : Déploiement sur un petit pourcentage d'utilisateurs
- **A/B Testing** : Test de deux versions simultanément

#### 3. Tests d'intégration
```yaml
- name: Integration tests
  run: |
    # Démarrer l'environnement de test
    docker compose -f docker-compose.test.yml up -d
    
    # Attendre que les services soient prêts
    ./wait-for-services.sh
    
    # Exécuter les tests d'intégration
    npm run test:integration
    
    # Nettoyer
    docker compose -f docker-compose.test.yml down
```

## Récapitulatif et bonnes pratiques

### Checklist Dockerfile
- [ ] Utiliser des images de base officielles et légères
- [ ] Optimiser l'ordre des instructions pour le cache
- [ ] Utiliser multi-stage builds pour réduire la taille
- [ ] Créer un utilisateur non-root
- [ ] Ajouter des HEALTHCHECK
- [ ] Utiliser .dockerignore
- [ ] Éviter d'installer des packages inutiles

### Checklist Docker Compose
- [ ] Définir des réseaux appropriés
- [ ] Utiliser des volumes pour la persistance
- [ ] Configurer les health checks
- [ ] Gérer les dépendances entre services
- [ ] Utiliser des variables d'environnement
- [ ] Prévoir différents environnements (dev/prod)

### Checklist CI/CD
- [ ] Tests automatisés à chaque push
- [ ] Scan de sécurité des images
- [ ] Build multi-architecture
- [ ] Déploiement automatisé sécurisé
- [ ] Monitoring et alertes
- [ ] Stratégie de rollback
