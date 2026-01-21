# Démonstration des Volumes Docker

Ce projet démontre pourquoi les volumes Docker sont essentiels pour le développement et pourquoi le simple `COPY` ne suffit pas.

## Objectifs pédagogiques

- Comprendre la différence entre `COPY` et les volumes
- Voir l'impact sur le workflow de développement
- Apprendre la persistance des données
- Maîtriser docker-compose avec volumes

## Structure du projet

```
exo-4-dockerfile-dev/
├── app.js                    # Application Express avec API
├── package.json              # Dépendances Node.js
├── Dockerfile               # Version SANS volumes (problématique)
├── Dockerfile.dev           # Version AVEC volumes (recommandée)
├── docker-compose.yml       # Comparaison des deux approches
├── docker-compose.prod.yml  # Configuration production
├── data/
│   └── config.json          # Données à persister
├── public/
│   └── index.html           # Interface de test
└── README.md               # Ce fichier
```

## Démarrage rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Test SANS volumes (problématique)
```bash
# Démarre sur le port 3001
docker-compose up app-sans-volumes
```

### 3. Test AVEC volumes (recommandé)
```bash
# Démarre sur le port 3000
docker-compose up app-avec-volumes
```

### 4. Interface de test
Ouvrez http://localhost:3000/index.html pour tester l'API

## Expériences à réaliser

### Expérience 1 : Modification du code

1. **Sans volumes** : Lancez `app-sans-volumes`
2. Modifiez le message dans `app.js` ligne 15
3. Rechargez http://localhost:3001 → **Aucun changement !**
4. Il faut rebuilder l'image : `docker-compose build app-sans-volumes`

5. **Avec volumes** : Lancez `app-avec-volumes`  
6. Modifiez le même message dans `app.js`
7. Rechargez http://localhost:3000 → **Changement instantané !**

### Expérience 2 : Persistance des données

1. Utilisez l'interface web pour sauvegarder des données
2. Arrêtez et redémarrez les conteneurs
3. **Sans volumes** : Données perdues
4. **Avec volumes** : Données conservées

### Expérience 3 : Logs

1. Consultez les logs via l'API `/logs`
2. Redémarrez les conteneurs
3. Observez la persistance des logs avec volumes

## Comparaison détaillée

| Aspect | COPY (sans volumes) | Volumes |
|--------|-------------------|---------|
| **Changements code** | Rebuild nécessaire | Instantané |
| **Persistance données** | ❌ Perdues | ✅ Conservées |
| **Temps de développement** | Lent | Rapide |
| **Synchronisation** | Manuelle | Automatique |
| **Production** | ✅ Approprié | ⚠️ Code externe |

## Commandes utiles

### Développement
```bash
# Démarrer avec volumes
docker-compose up app-avec-volumes

# Démarrer en arrière-plan
docker-compose up -d app-avec-volumes

# Voir les logs
docker-compose logs -f app-avec-volumes

# Arrêter
docker-compose down
```

### Production
```bash
# Configuration production (sans volume de code)
docker-compose -f docker-compose.prod.yml up -d
```

### Gestion des volumes
```bash
# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect exo-4-dockerfile-dev_app-data

# Supprimer les volumes
docker-compose down -v
```

## 🎓 Points clés à retenir

### Pourquoi COPY ne suffit pas en développement ?

1. **Immutabilité des images** : Une fois buildée, l'image ne change pas
2. **Cycle lent** : Modifier → Rebuild → Redémarrer → Tester
3. **Perte de données** : Chaque rebuild efface les données
4. **Productivité réduite** : Workflow inefficace

### Avantages des volumes

1. **Synchronisation temps réel** : Changements instantanés
2. **Persistance** : Données conservées entre redémarrages
3. **Séparation** : Code ≠ Données ≠ Configuration
4. **Flexibilité** : Différents types de volumes selon les besoins

### Types de volumes utilisés

```yaml
volumes:
  # Bind mount : synchronise le code local
  - .:/app
  
  # Volume anonyme : exclut node_modules
  - /app/node_modules
  
  # Volume nommé : persiste les données
  - app-data:/app/data
```

## Architecture recommandée

### Développement
- **Code** : Bind mount (`.:/app`)
- **Dépendances** : Volume anonyme (`/app/node_modules`)
- **Données** : Volume nommé (`app-data:/app/data`)
- **Logs** : Volume nommé (`app-logs:/app/logs`)

### Production
- **Code** : COPY dans l'image (sécurité)
- **Données** : Volume nommé (persistance)
- **Configuration** : Secrets/ConfigMaps

## Problèmes courants

### "node_modules not found"
**Solution** : Utilisez un volume anonyme pour exclure node_modules
```yaml
volumes:
  - .:/app
  - /app/node_modules  # Exclut le dossier local
```

### "Permission denied"
**Solution** : Vérifiez les permissions ou utilisez un utilisateur approprié
```dockerfile
USER node
```

### "Changes not reflected"
**Solution** : Vérifiez que le bind mount est correct
```yaml
volumes:
  - .:/app  # Dossier courant vers /app
```

## Ressources supplémentaires

- [Documentation Docker Volumes](https://docs.docker.com/storage/volumes/)
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Node.js in Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Conseil** : En développement, utilisez toujours des volumes. En production, préférez COPY pour la sécurité et la reproductibilité.
