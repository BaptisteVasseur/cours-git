# Exercice Git : Gestion des branches

**Objectif :** Maîtriser la création, fusion et suppression de branches

## Mission 1 : Créer une branche

### 1. Créer et se placer sur une nouvelle branche

<details>
<summary>💡 Spoiler - Commandes pour créer une branche</summary>

```bash
# Méthode classique
git branch feature-emoji
git checkout feature-emoji

# Ou en une seule commande
git checkout -b feature-emoji

# Méthode moderne (recommandée)
git switch -c feature-emoji
```
</details>

### 2. Vérifier la branche active

<details>
<summary>💡 Spoiler - Commande pour voir les branches</summary>

```bash
git branch
# La branche active est marquée avec un *
```
</details>

## Mission 2 : Travailler avec du code JavaScript

### 1. Installer les dépendances Node.js

<details>
<summary>💡 Spoiler - Installation des modules</summary>

```bash
npm install
```

**Note :** Cette commande va créer le dossier `node_modules` qui doit être ignoré par Git.
</details>

### 2. Vérifier le .gitignore

<details>
<summary>💡 Spoiler - Contenu du .gitignore</summary>

Le fichier `.gitignore` doit contenir :
```
node_modules/
npm-debug.log
.env
```
</details>

### 3. Modifier le dictionnaire emoji

Complète le dictionnaire `wordToEmoji` dans `code/main.js` avec de nouveaux emojis.

<details>
<summary>💡 Spoiler - Exemples d'emojis à ajouter</summary>

```javascript
const wordToEmoji = {
    'coeur': '❤️',
    'amour': '💕',
    'chat': '🐱',
    'chien': '🐶',
    'soleil': '☀️',
    'lune': '🌙',
    'eau': '💧',
    'feu': '🔥',
    'terre': '🌍',
    // Nouveaux emojis
    'voiture': '🚗',
    'maison': '🏠',
    'pizza': '🍕',
    'café': '☕',
    'livre': '📚'
};
```
</details>

### 4. Tester le code

<details>
<summary>💡 Spoiler - Commande pour tester</summary>

```bash
node code/main.js
```
</details>

### 5. Commiter les changements

<details>
<summary>💡 Spoiler - Commandes de commit</summary>

```bash
git add .
git commit -m "✨ Add new emojis to dictionary"

# Vérifier le statut
git status
```
</details>

## Mission 3 : Fusionner les branches

### 1. Retourner sur la branche principale

<details>
<summary>💡 Spoiler - Commandes pour changer de branche</summary>

```bash
git checkout main
# ou
git switch main
```
</details>

### 2. Fusionner la branche feature

<details>
<summary>💡 Spoiler - Commande de merge</summary>

```bash
git merge feature-emoji
```

**Note :** Tu fusionnes `feature-emoji` dans `main` car tu es sur la branche `main`.
</details>

### 3. Supprimer la branche devenue inutile

<details>
<summary>💡 Spoiler - Commande pour supprimer une branche</summary>

```bash
git branch -d feature-emoji
```

**Note :** `-d` signifie "delete". Sans le `-d`, tu créerais une nouvelle branche !
</details>

## Résultat attendu

- Une nouvelle branche créée et fusionnée
- Le dictionnaire emoji enrichi
- L'historique Git propre avec un merge commit

## Questions à se poser

- Quelle est la différence entre `git checkout` et `git switch` ?
- Pourquoi faut-il être sur la branche de destination pour faire un merge ?
- Que se passe-t-il si on oublie de supprimer les branches ?

## Bonus

Essaie de créer plusieurs branches en parallèle et de les fusionner dans un ordre différent !
