# Cours complet : Maîtriser Git de A à Z

Bienvenu dans ce cours complet sur Git ! Ce n'est pas juste un TP, mais un véritable parcours d'apprentissage pour devenir autonome avec Git. Tu vas comprendre **pourquoi** Git fonctionne comme ça, **comment** l'utiliser efficacement, et **quand** appliquer les bonnes pratiques.

## Objectifs du cours

À la fin de ce cours, tu seras capable de :
- **Comprendre** la philosophie et les concepts fondamentaux de Git
- **Utiliser** Git au quotidien pour tes projets personnels et professionnels
- **Collaborer** efficacement en équipe avec Git et GitHub
- **Résoudre** les problèmes courants et les situations complexes
- **Appliquer** les bonnes pratiques du développement moderne

## Prérequis

Pour pouvoir faire ce TP, il te faudra le logiciel Git installé sur ton ordinateur :

- Si tu es sous Linux ou Mac, git est normalement déjà installé.
- Si tu es sous Windaube, je te conseille d'installer Linux (ou WSL ou GitBash si vraiment tu veux rester sur ce faux OS).
- Node.js installé sur votre machine pour exécuter les exemples JavaScript.

Ce TP va aussi utiliser l'éditeur de code VSCode. Je te conseille de l'utiliser aussi pour plus de clarté mais tu peux utiliser un autre éditeur de code comme WebStorm ou PHPStorm.

Maintenant que les prérequis sont installés, il est temps de se lancer !

## Partie 0 : Comprendre Git avant de commencer

### Qu'est-ce que Git exactement ?

Git n'est pas juste un "outil de sauvegarde" ! C'est un **système de contrôle de version distribué** qui :

- **Suit l'évolution** de tes fichiers dans le temps
- **Permet de revenir** à n'importe quelle version précédente
- **Facilite la collaboration** entre développeurs
- **Garde un historique complet** de qui a fait quoi et quand
- **Gère les branches** pour développer plusieurs fonctionnalités en parallèle

### Les concepts fondamentaux

#### Repository (repo)
Un dossier "magique" qui contient :
- Tes fichiers de projet
- L'historique complet des modifications
- Les métadonnées Git (dans le dossier caché `.git/`)

#### Commit
Un "instantané" de ton projet à un moment donné. Chaque commit contient :
- Les modifications apportées
- Un message descriptif
- L'auteur et la date
- Un identifiant unique (hash)

#### Branches
Des "lignes de développement" parallèles qui permettent de :
- Travailler sur plusieurs fonctionnalités simultanément
- Isoler les modifications en cours
- Fusionner le travail quand c'est prêt

### Configuration de Git

Avant de pouvoir utiliser Git, il y a quelques configurations essentielles à faire.

### Ajout d'un nom et email dans Git

Pour que les modifications que tu feras sur le repository soient identifiables, il faut fournir un nom et une adresse email. Pour faire cette configuration, ouvre GitBash (ou un terminal pour Mac/Linux) et entre les commandes suivantes en remplaçant nom et adresse email :

```bash
git config --global user.name "votre nom"
git config --global user.email "votre adresse email"
```

Git sait maintenant qui tu es et le nom choisi sera associé aux modifications que tu feras.

### Configuration de l'éditeur par défaut

Il est recommandé de configurer un éditeur par défaut pour Git (ici pour vscode) :

```bash
git config --global core.editor "code --wait"
```

Cette commande configure VSCode comme éditeur par défaut.

### Configuration de la clé SSH (si nécessaire)

(à toi de chercher un peu sur la doc de Github, elle est bien faite)

## Partie 1 : Créer ton premier repository

### Comprendre ce qui se passe

Quand tu initialises un repository Git, voici ce qui se passe :

1. **Git crée un dossier caché `.git/`** qui contient toute la "magie"
2. **Ton dossier devient "surveillé"** par Git
3. **Tes fichiers passent par 3 états** : modifié → indexé → committé

### Les 3 zones de Git

```
Répertoire de travail  →  Zone d'index (staging)  →  Repository Git
     (tes fichiers)           (git add)              (git commit)
```

- **Working Directory** : Tes fichiers actuels
- **Staging Area** : Les modifications prêtes à être sauvegardées
- **Git Repository** : L'historique permanent

### Mission 1 : Initialiser un repository

```bash
git init
```

**Ce qui se passe :** Git crée le dossier `.git/` et initialise la base de données des versions.

```bash
git status
```

**Ce que tu vois :** Git te montre l'état actuel de ton répertoire de travail.

### Mission 2 : Premier commit

Ajoute le fichier README.md à l'index Git :

```bash
git add README.md
```

Crée ton premier commit :

```bash
git commit -m ":tada: Mon super nom de commit avec un émoji"
```

Vérifie l'historique des commits :

```bash
git log
```

## Partie 2 : Versionnage et Gestion des fichiers

### Mission 1 : Modifier un fichier

Dans un repo git, l'édition des fichiers se fait comme dans un dossier classique. Mais cette modification en local doit ensuite être synchronisée avec le serveur.

Voici ci-dessous une ligne moche et inutile. Sauras-tu la supprimer ?

**Cette ligne est moche et inutile, supprime-la !**

Il existe aussi un module git intégré à VSCode, je t'encourage à essayer de l'utiliser pour supprimer la deuxième ligne moche et inutile ci-dessous.

**Cette ligne est aussi moche et inutile, supprime-la !**

Pour vérifier tes modifications :

```bash
git status
git diff
```

Pour ajouter et commiter tes modifications :

```bash
git add README.md
git commit -m "Remove useless lines from README"
```

### Mission 2 : Ajouter un fichier

Ta deuxième mission est de créer un fichier `solutions.md` à la racine du repo (à côté du README.md) et d'y ajouter la démarche que tu as suivie pour réussir la mission précédente. (en gros tu retapes les commandes dans le fichier)

**Remarque :** L'extension de fichier `.md` signifie Markdown. Ce format permet de faire un peu de mise en page simple de fichier texte. Tu peux utiliser le raccourci `Ctrl+Shift+V` dans VSCode pour visualiser ce type de fichier.

Une fois le fichier créé, n'oublie pas de créer un commit (ajoute un gitmoji pour que ce soit encore plus cool) :

```bash
git add solutions.md
git commit -m "Add solutions documentation"
```

### Mission 3 : Supprimer un fichier

Il y a dans le repo un fichier nommé `fichier_inutile.txt`. Sauras-tu le supprimer du repo Git ?

```bash
git rm fichier_inutile.txt
git commit -m "Remove useless file"
```

Les quelques commandes que tu viens d'utiliser (`git status`, `git add`, `git commit`, `git log`) sont les commandes que tu utiliseras 95% du temps avec Git.

## Partie 3 : Branches et Collaboration

Pour pouvoir travailler séparément sur des features différentes, on utilise des branches. Cette fonctionnalité est particulièrement pratique pour faire avancer en même temps plusieurs versions du même code qui implémentent des fonctionnalités différentes.

### Exercice pratique détaillé

Pour une pratique guidée avec des spoilers sur les commandes, consulte : **[Exercice Git : Gestion des branches](../exercices/git-exercice-branches.md)**

### Mission 1 : Créer une branche

Crée une branche et place-toi sur cette nouvelle branche :

```bash
git branch feature-emoji
git checkout feature-emoji
# Ou en une seule commande :
# git checkout -b feature-emoji
```

> Maintenant on doit utiliser la commande `git switch`) car les précédentes sont "dépréciées", essaye de l'utiliser aussi ça pourra être utile :)

Vérifie que cette branche est bien sélectionnée :

```bash
git branch
```

### Mission 2 : Travailler avec du code JavaScript

Consulte le code JavaScript de `code/main.js`. Il remplace des mots courants par leur équivalent emoji.

**Si tu veux exécuter ton code mais tu as une erreur de module :**
Il faut installer les modules Node.js avec la commande :

```bash
npm install
```

Cette commande va installer tous les modules JavaScript listés dans le fichier `package.json`.

Complète le dictionnaire `wordToEmoji` avec quelques emojis supportés. Tu peux trouver la liste [ici](https://emojipedia.org/).

Si tu as exécuté le fichier JavaScript `node code/main.js`, tu as peut-être pu remarquer l'apparition du dossier `node_modules`. Ces fichiers ne sont pas intéressants à versionner avec Git (car pas nécessaires - ils peuvent être régénérés avec `npm install`). Il faut donc ajouter un `.gitignore` pour les ignorer : vérifie que le fichier `.gitignore` à la racine du repo contient bien `node_modules/`.

Commit et push tes changements :

```bash
git add .
git commit -m "Add emoji functionality to main.js"
```

Si tu fais un `git status`, est-ce que tout te semble ok ? si oui alors passe à la suite. Si non, qu'est-ce qu'il faut retirer ?

### Mission 3 : Fusionner les branches

Retourne sur la branche principale :

```bash
git checkout main
# ou git checkout master selon le nom de ta branche principale
```

Fusionne ta branche feature :

```bash
git merge feature-emoji
```

> Là pour rappel du vas fusionner la branche `feature-emoji` dans ta branche `main`, car tu est sur la branche `main` là

Supprime la branche devenue inutile :

```bash
git branch -d feature-emoji
```

> Si tu mets pas le `-d` ça créé la branche et si tu ajoutes le `-d` ça veut dire 'delete' le branch, logique non ?

## Partie 4 : Résolution de conflits

### Exercice pratique détaillé

Pour une pratique guidée avec des spoilers sur les commandes, consulte : **[Exercice Git : Résolution de conflits](../exercices/git-exercice-conflits.md)**

### Mission 1 : Créer un conflit

Crée deux branches à partir de `main` :

```bash
git checkout -b branch-a
# Modifie le fichier code/main.js
git add .
git commit -m "Modify emoji dictionary - version A"

git checkout main
git checkout -b branch-b
# Modifie la même ligne du fichier code/main.js différemment
git add .
git commit -m "Modify emoji dictionary - version B"
```

### Mission 2 : Résoudre le conflit

Retourne sur `main` et essaie de fusionner les deux branches :

```bash
git checkout main
git merge branch-a
git merge branch-b  # Ceci va créer un conflit !
```

Git t'indiquera qu'il y a un conflit. Ouvre le fichier en conflit dans VSCode et résous-le manuellement. VSCode t'aidera en affichant clairement les conflits.

Une fois résolu :

```bash
git add .
git commit -m "Resolve merge conflict"
```

> Bon là c'est facile car tu as une seule ligne, sur des projets plus gros ce sera peut-être des fois des dixaines de lignes. Git est assez intélligent pour en regler automatiquement certaines mais sinon ce sera à toi de le faire à chaque fois :(

## Partie 5 : Historique et Navigation

### Consulter l'historique

```bash
git log --oneline --graph --all
```

### Revenir en arrière

Pour voir un commit précédent :

```bash
git checkout <hash-du-commit>
```

Pour revenir au dernier commit :

```bash
git checkout main
```

### Annuler des modifications

Pour annuler des modifications non commitées :

```bash
git checkout -- <nom-du-fichier>
```

Pour annuler le dernier commit (en gardant les modifications) :

```bash
git reset --soft HEAD~1
```

## Partie 6 : Remote et Synchronisation

### Ajouter un remote

Si tu veux synchroniser avec un repository distant (GitHub, GitLab, etc.) :

```bash
git remote add origin <URL-du-repository>
```

En gros cette commande va dire ou envoyer nos modifs (sur quel serveur) et on va appeler ce serveur "origin".

### Pousser vers le remote

```bash
git push -u origin main
```

Va permettre d'envoyer nos modifications sur la branche "main" du serveur qui s'appelle "origin"

### Récupérer depuis le remote

```bash
git pull origin main
```

Récupère les modifs de la branche "main" du serveur "origin"

## Conclusion

Bien sûr, on n'a abordé qu'une petite partie de Git, mais ce que tu viens de voir c'est vraiment la base !

Dernier conseil : Git réserve parfois quelques situations un peu complexes, notamment lorsque des conflits se créent entre deux modifications. Il faut alors les résoudre à la main (heureusement VSCode aide en affichant les conflits). Et pense à bien regarder ce que Git te donne comme infos, en général la démarche à suivre pour résoudre l'erreur est dans le message d'erreur. 

## Partie 7 : Défis avancés (pour les plus téméraires)

### Défi 1 : Workflow collaboratif complet

Tu vas simuler un workflow de développement en équipe en ajoutant plusieurs features au convertisseur emoji :

1. **Feature A** - Interface web : Crée une branche `feature/web-ui` et développe :
   - Un fichier `web/index.html` avec une zone de texte et affichage en temps réel
   - Un fichier `web/style.css` pour styliser l'interface
   - Un fichier `web/app.js` qui utilise le convertisseur emoji

2. **Feature B** - Nouvelles catégories : Crée une branche `feature/categories` et ajoute :
   - Une fonction `addAnimalEmojis()` qui ajoute des emojis d'animaux
   - Une fonction `addFoodEmojis()` qui ajoute des emojis de nourriture
   - Une fonction `addWeatherEmojis()` qui ajoute des emojis météo

3. Simule des commits réguliers sur les deux branches (au moins 3 commits par branche)
4. Fais un rebase de `feature/web-ui` sur master
5. Merge `feature/categories` dans master
6. Résous les conflits potentiels entre les deux features
7. Utilise `git log --graph --oneline --all` pour visualiser ton travail

### Défi 2 : Features d'amélioration du convertisseur

Ajoute des fonctionnalités avancées au convertisseur :

1. **Synonymes** : Ajoute un système de synonymes pour reconnaître plus de mots (ex: "content" → "coeur")
2. **Expressions** : Détecte des expressions comme "je t'aime" → "💕"
3. **Emojis composés** : Combine plusieurs emojis pour certaines phrases
4. **Mode aléatoire** : Choisi aléatoirement parmi plusieurs emojis pour un même mot

### Défi 3 : Optimisation et tests

Améliore la qualité du code :

1. **Tests unitaires** : Crée un fichier `test/emoji-test.js` avec des tests pour chaque fonction
2. **Validation d'entrée** : Ajoute une validation pour s'assurer que les emojis sont valides
3. **Performance** : Optimise la conversion pour de très longs textes (livres entiers)
4. **Documentation** : Ajoute de la JSDoc à toutes les fonctions avec exemples d'usage

### Défi 4 : CLI et configuration

Transforme le script en outil en ligne de commande :

1. **Arguments CLI** : Utilise `process.argv` pour accepter du texte directement
2. **Fichier de config** : Crée un système de configuration via fichier `emoji-config.json`
3. **Mode interactif** : Ajoute un mode interactif pour saisir du texte en temps réel
4. **Help et version** : Implémente `--help` et `--version` avec exemples d'usage

### Défi 5 : Intégration et déploiement

Configure l'automatisation :

1. **Scripts npm** : Ajoute des scripts dans `package.json` pour test, convert, interactive
2. **Hooks pre-commit** : Configure un hook qui vérifie la syntaxe et lance les tests
3. **CI/CD simulation** : Crée un script `deploy.sh` qui simule le déploiement du convertisseur
4. **Versioning** : Utilise les tags Git pour versionner ton outil emoji

