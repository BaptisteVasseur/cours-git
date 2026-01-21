# Exercice Docker 1 : Container Node.js

**Objectif :** Découvrir les bases de Docker avec Node.js

## 1. Démarrer un container Node.js

<details>
<summary>💡 Spoiler - Commande pour démarrer le container</summary>

```bash
docker run -it node:18 bash
```
</details>

## 2. Rentrer dans le container et exécuter le terminal 'sh'

Tu es déjà dans le container avec la commande précédente. Vérifie que tu es bien dans le container :

<details>
<summary>💡 Spoiler - Commandes de vérification</summary>

```bash
whoami
pwd
```
</details>

## 3. Afficher la version de Node.js dans le terminal

<details>
<summary>💡 Spoiler - Commandes pour voir les versions</summary>

```bash
node --version
npm --version
```
</details>

## 4. Créer un fichier .js sur ton ordinateur avec un petit code JavaScript

Sur ton ordinateur (dans un nouveau terminal), crée un fichier `test-node.js` :

<details>
<summary>💡 Spoiler - Contenu du fichier JavaScript</summary>

```javascript
console.log("Hello Docker depuis Node.js !");
console.log("Version de Node:", process.version);
console.log("Plateforme:", process.platform);

const numbers = [1, 2, 3, 4, 5];
console.log("Somme:", numbers.reduce((a, b) => a + b, 0));
```
</details>

## 5. Copier ce fichier dans le container Docker

<details>
<summary>💡 Spoiler - Commandes pour copier le fichier</summary>

```bash
# Dans un nouveau terminal (pas dans le container)
# Trouve l'ID de ton container
docker ps

# Copie le fichier dans le container
docker cp test-node.js <container>:/tmp/test-node.js
```
</details>

## 6. Exécuter le fichier .js avec Node.js présent dans l'image Docker

<details>
<summary>💡 Spoiler - Commandes pour exécuter le fichier</summary>

```bash
# Retourne dans ton container (premier terminal)
cd /tmp
node test-node.js
```
</details>

## Résultat attendu

Tu devrais voir s'afficher :
- La version de Node.js
- La plateforme (linux)
- La somme des nombres (15)

## Questions à se poser

- Pourquoi utilise-t-on `docker cp` plutôt que de créer le fichier directement dans le container ?
- Que se passe-t-il si tu arrêtes et relances le container ?
