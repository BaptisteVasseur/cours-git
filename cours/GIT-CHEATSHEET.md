# Cheatsheet Git - Aide-mémoire

## Configuration initiale

```bash
# Configuration utilisateur
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Configuration éditeur
git config --global core.editor "code --wait"

# Voir la configuration
git config --list
```

## Commandes de base

### Initialisation et statut
```bash
git init                    # Initialise un nouveau repository
git status                  # Affiche l'état du repository
git log                     # Affiche l'historique des commits
git log --oneline          # Historique condensé
git log --graph --all      # Historique graphique
```

### Ajout et commit
```bash
git add <fichier>          # Ajoute un fichier à l'index
git add .                  # Ajoute tous les fichiers modifiés
git add -A                 # Ajoute tous les fichiers (y compris supprimés)
git commit -m "message"    # Crée un commit avec un message
git commit -am "message"   # Add + commit en une commande
```

### Différences et modifications
```bash
git diff                   # Affiche les différences non indexées
git diff --staged          # Affiche les différences indexées
git diff HEAD              # Affiche toutes les différences
git show                   # Affiche le dernier commit
git show <hash>            # Affiche un commit spécifique
```

## Gestion des branches

### Création et navigation
```bash
git branch                 # Liste les branches
git branch <nom>           # Crée une nouvelle branche
git checkout <branche>     # Change de branche
git checkout -b <branche>  # Crée et change de branche
git switch <branche>       # Change de branche (moderne)
git switch -c <branche>    # Crée et change de branche (moderne)
```

### Fusion et suppression
```bash
git merge <branche>        # Fusionne une branche
git branch -d <branche>    # Supprime une branche fusionnée
git branch -D <branche>    # Force la suppression d'une branche
```

## Annulation et correction

### Modifications non commitées
```bash
git checkout -- <fichier>  # Annule les modifications d'un fichier
git reset HEAD <fichier>   # Retire un fichier de l'index
git reset --hard           # Annule toutes les modifications
```

### Commits
```bash
git reset --soft HEAD~1    # Annule le dernier commit (garde les modifications)
git reset --mixed HEAD~1   # Annule le dernier commit et l'index
git reset --hard HEAD~1    # Annule tout (DANGEREUX)
git revert <hash>          # Crée un commit qui annule un commit précédent
```

### Modification du dernier commit
```bash
git commit --amend -m "nouveau message"  # Modifie le message du dernier commit
git commit --amend                       # Modifie le dernier commit (ajoute des fichiers)
```

## Remotes et synchronisation

### Configuration remote
```bash
git remote add origin <URL>     # Ajoute un remote
git remote -v                   # Liste les remotes
git remote remove origin        # Supprime un remote
```

### Synchronisation
```bash
git clone <URL>                 # Clone un repository
git fetch                       # Récupère les changements sans fusionner
git pull                        # Récupère et fusionne (fetch + merge)
git push                        # Envoie les commits locaux
git push -u origin <branche>    # Premier push d'une branche
git push --force                # Force le push (DANGEREUX)
```

## Commandes avancées

### Stash (remisage)
```bash
git stash                      # Sauvegarde temporairement les modifications
git stash pop                  # Restaure et supprime le stash
git stash list                 # Liste les stashes
git stash drop                 # Supprime un stash
```

### Cherry-pick et rebase
```bash
git cherry-pick <hash>         # Applique un commit spécifique
git rebase <branche>           # Rebase la branche courante
git rebase -i HEAD~3           # Rebase interactif des 3 derniers commits
```

### Tags
```bash
git tag                        # Liste les tags
git tag <nom>                  # Crée un tag
git tag -a <nom> -m "message"  # Crée un tag annoté
git push --tags                # Pousse les tags
```

## Gestion des fichiers

### Suppression et déplacement
```bash
git rm <fichier>               # Supprime un fichier du repository
git rm --cached <fichier>      # Retire un fichier du suivi (garde le fichier)
git mv <ancien> <nouveau>      # Renomme/déplace un fichier
```

### .gitignore
```bash
# Exemples de patterns dans .gitignore
*.log                          # Ignore tous les fichiers .log
build/                         # Ignore le dossier build
!important.log                 # Exception : ne pas ignorer ce fichier
temp*.txt                      # Ignore les fichiers commençant par temp
```

## Résolution de conflits

Quand un conflit survient :
1. Git marque les fichiers en conflit
2. Édite les fichiers pour résoudre les conflits
3. `git add <fichier>` pour marquer comme résolu
4. `git commit` pour finaliser la fusion

Marqueurs de conflit :
```
<<<<<<< HEAD
Votre version
=======
Leur version
>>>>>>> branche-name
```

## Astuces utiles

### Alias Git
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

### Recherche
```bash
git grep "texte"               # Recherche dans les fichiers
git log --grep="message"       # Recherche dans les messages de commit
git log -S "code"              # Recherche dans le contenu des commits
```

### Historique d'un fichier
```bash
git log --follow <fichier>     # Historique d'un fichier (même renommé)
git blame <fichier>            # Qui a écrit chaque ligne
git show HEAD:<fichier>        # Contenu d'un fichier à un commit donné
```

## En cas d'urgence 🚨

### J'ai committé sur la mauvaise branche
```bash
git reset --soft HEAD~1        # Annule le commit, garde les modifications
git stash                      # Sauvegarde les modifications
git checkout <bonne-branche>   # Va sur la bonne branche
git stash pop                  # Restaure les modifications
git commit -m "message"        # Commit sur la bonne branche
```

### J'ai fait une erreur dans mon commit
```bash
git commit --amend -m "nouveau message"  # Corrige le message
# ou
git reset --soft HEAD~1        # Annule le commit, refait-le
```

### J'ai perdu des commits
```bash
git reflog                     # Affiche l'historique des actions
git checkout <hash>            # Récupère l'état perdu
git branch sauvegarde          # Crée une branche pour sauvegarder
```

---
**Conseil** : En cas de doute, `git status` est votre ami ! Git donne souvent des indications sur les commandes à utiliser.
