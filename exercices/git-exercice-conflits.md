# Exercice Git : Résolution de conflits

**Objectif :** Apprendre à créer et résoudre des conflits de merge

## Mission 1 : Créer un conflit

### 1. Créer la première branche et modifier le code

<details>
<summary>💡 Spoiler - Commandes pour la branche A</summary>

```bash
git checkout -b branch-a
# ou
git switch -c branch-a
```

Modifie le fichier `code/main.js` en ajoutant quelques emojis :
```javascript
// Ajoute ces lignes au dictionnaire
'étoile': '⭐',
'fusée': '🚀',
'robot': '🤖'
```

Puis commit :
```bash
git add .
git commit -m "🚀 Add space-themed emojis - version A"
```
</details>

### 2. Créer la deuxième branche et modifier la même zone

<details>
<summary>💡 Spoiler - Commandes pour la branche B</summary>

```bash
git checkout main
git switch -c branch-b
```

Modifie le **même endroit** dans `code/main.js` avec d'autres emojis :
```javascript
// Ajoute ces lignes au dictionnaire (même zone que branch-a)
'étoile': '🌟',
'vaisseau': '🛸',
'alien': '👽'
```

Puis commit :
```bash
git add .
git commit -m "👽 Add alien-themed emojis - version B"
```
</details>

## Mission 2 : Provoquer le conflit

### 1. Fusionner la première branche

<details>
<summary>💡 Spoiler - Merge de branch-a</summary>

```bash
git checkout main
git merge branch-a
```

**Résultat :** Pas de problème, fusion réussie ! ✅
</details>

### 2. Fusionner la deuxième branche (conflit !)

<details>
<summary>💡 Spoiler - Merge de branch-b qui va créer un conflit</summary>

```bash
git merge branch-b
```

**Résultat :** Git va te dire qu'il y a un conflit ! ⚠️

Message type :
```
Auto-merging code/main.js
CONFLICT (content): Merge conflict in code/main.js
Automatic merge failed; fix conflicts and then commit the result.
```
</details>

## Mission 3 : Résoudre le conflit

### 1. Identifier les fichiers en conflit

<details>
<summary>💡 Spoiler - Commandes pour voir les conflits</summary>

```bash
git status
# Montre les fichiers "both modified"

git diff
# Montre les détails des conflits
```
</details>

### 2. Ouvrir le fichier en conflit dans VSCode

Le fichier `code/main.js` va contenir quelque chose comme :

<details>
<summary>💡 Spoiler - Format des marqueurs de conflit</summary>

```javascript
const wordToEmoji = {
    'coeur': '❤️',
    // ... autres emojis ...
    'étoile': '🌟',
    'vaisseau': '🛸',
    'alien': '👽'
};
```

**Explication des marqueurs :**
- `<<<<<<< HEAD` : Début du contenu de la branche courante (main)
- `=======` : Séparateur entre les deux versions
- `>>>>>>> branch-b` : Fin du contenu de la branche à fusionner
</details>

### 3. Résoudre manuellement le conflit

<details>
<summary>💡 Spoiler - Exemple de résolution</summary>

Choisis ce que tu veux garder. Par exemple, garder les deux :

```javascript
const wordToEmoji = {
    'coeur': '❤️',
    // ... autres emojis ...
    'étoile': '⭐',
    'fusée': '🚀',
    'robot': '🤖',
    'vaisseau': '🛸',
    'alien': '👽'
};
```

**Important :** Supprime tous les marqueurs de conflit (`<<<<<<<`, `=======`, `>>>>>>>`) !
</details>

### 4. Finaliser la résolution

<details>
<summary>💡 Spoiler - Commandes pour finaliser</summary>

```bash
# Ajouter le fichier résolu
git add code/main.js

# Commiter la résolution
git commit -m "🔧 Resolve merge conflict: combine space and alien emojis"
```
</details>

## Mission 4 : Vérifier le résultat

### 1. Tester le code fusionné

<details>
<summary>💡 Spoiler - Test du résultat</summary>

```bash
node code/main.js
```

Vérifie que tous les emojis fonctionnent correctement !
</details>

### 2. Voir l'historique

<details>
<summary>💡 Spoiler - Commandes pour voir l'historique</summary>

```bash
git log --oneline --graph --all
```

Tu devrais voir un joli graphique avec les branches qui se rejoignent !
</details>

## Résultat attendu

- Un conflit créé et résolu manuellement
- Un commit de merge avec les deux modifications combinées
- Un historique Git qui montre clairement les branches et la fusion

## Questions à se poser

- Pourquoi Git ne peut-il pas résoudre automatiquement ce conflit ?
- Comment éviter les conflits en équipe ?
- Que se passe-t-il si on oublie de supprimer les marqueurs de conflit ?

## Conseils pour éviter les conflits

1. **Communiquer** avec l'équipe sur qui travaille sur quoi
2. **Faire des commits fréquents** et des branches courtes
3. **Synchroniser régulièrement** avec la branche principale
4. **Diviser le travail** par fichiers/fonctionnalités distinctes

## En cas de panique

Si tu es perdu dans la résolution :

<details>
<summary>💡 Spoiler - Commandes d'urgence</summary>

```bash
# Annuler le merge en cours
git merge --abort

# Revenir à l'état d'avant le merge
git reset --hard HEAD~1
```

**Attention :** Ces commandes annulent tout le travail de résolution !
</details>
