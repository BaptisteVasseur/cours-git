# Docker Cheatsheet - Aide-mémoire

## Installation et vérification

```bash
# Vérifier la version
docker --version

# Informations système
docker info
docker system df

# Aide sur une commande
docker help
docker run --help
```

## Containers Docker

### Lancer des containers
```bash
# Lancer un container
docker run nginx                       # Démarre un container basé sur l'image 'nginx'
docker run -d nginx                    # En arrière-plan
docker run -it ubuntu bash             # Mode interactif
docker run --name mon-nginx nginx      # Avec un nom
docker run -p 8080:80 nginx            # Mapping de port
docker run -v /host/path:/container/path nginx  # Volume

# Options utiles
docker run -d --name web -p 80:80 -v $(pwd):/usr/share/nginx/html nginx
docker run --rm -it ubuntu bash       # Supprime automatiquement le container après l'arrêt
docker run -e NODE_ENV=production node # Variables d'environnement
```

### Gestion des containers
```bash
# Lister les containers
docker ps                    # Containers actifs
docker ps -a                 # Tous les containers

# Arrêter/démarrer
docker stop <container>
docker start <container>
docker restart <container>

# Supprimer
docker rm <container>
docker rm -f <container>     # Force la suppression
docker container prune       # Supprime tous les containers arrêtés
```

### Interaction avec les containers
```bash
# Voir les logs
docker logs <container>
docker logs -f <container>   # Suivi en temps réel
docker logs --tail 50 <container>  # 50 dernières lignes
docker logs -f --tail 50 <container>  # 50 dernières lignes en suit les nouvelles en temps réel

# Entrer dans un container
docker exec -it <container> bash # si bash est installé dans le container
docker exec -it <container> sh # sh = terminal par défaut

# Copier des fichiers
docker cp file.txt <container>:/path/ # copie du fichier file.txt ou la commande est lancée dans le dossier /path/ du container
docker cp <container>:/path/file.txt ./ # copie le fichier du container dans mon dossier local

```

## Docker Compose

### Commandes de base
```bash
# Lancer tous les services (comme : docker start)
docker compose up            # Démarre tout les containers du fichier docker compose
docker compose up -d         # En arrière-plan
docker compose up --build    # Rebuild les images 

# Arrêter (comme : docker stop)
docker compose down          # Arrète tout les containers du fichier docker compose
docker compose down -v       # Supprime aussi les volumes

# Voir les services (comme : docker ps ou docker logs)
docker compose ps
docker compose logs
docker compose logs <service>

# Redémarrer un service (comme : docker restart)
docker compose restart <service>

# Exécuter une commande (comme : docker start / run)
docker compose exec <service> bash
docker compose run <service> npm test
```

### Gestion des services
```bash
# Construire seulement (comme : docker build)
docker compose build
docker compose build <service>
```
