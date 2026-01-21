# Exercice Docker 2 : Container Alpine Linux

**Objectif :** Explorer un système Linux minimal et comprendre la persistance

## 1. Démarrer un container Alpine Linux

<details>
<summary>💡 Spoiler - Commande pour démarrer Alpine</summary>

```bash
docker run -it alpine:latest sh
```
</details>

## 2. Rentrer dans le container et exécuter le terminal 'sh'

Tu es déjà dans le container. Explore le système :

<details>
<summary>💡 Spoiler - Commandes d'exploration</summary>

```bash
ls -la
cat /etc/os-release
```
</details>

## 3. Afficher la version de Linux dans le terminal

<details>
<summary>💡 Spoiler - Commandes pour voir la version Linux</summary>

```bash
uname -a
cat /etc/alpine-release
```
</details>

## 4. Installer cmatrix dans le container

<details>
<summary>💡 Spoiler - Commandes d'installation</summary>

```bash
# Mettre à jour les paquets
apk update

# Installer cmatrix
apk add cmatrix
```
</details>

## 5. Lancer cmatrix, qu'est-ce qu'il se passe ?

<details>
<summary>💡 Spoiler - Commande pour lancer cmatrix</summary>

```bash
cmatrix
# Appuie sur Ctrl+C pour arrêter
```

**Résultat :** Tu verras une animation style "Matrix" avec des caractères qui tombent ! 🕶️
</details>

## 6. Test de persistance

**Question :** Si tu refais un `docker run`, le paquet est-il dans le nouveau container ?

<details>
<summary>💡 Spoiler - Test de persistance</summary>

```bash
# Sors du container
exit

# Lance un nouveau container alpine
docker run -it alpine:latest sh

# Vérifie si cmatrix est installé
cmatrix
# Spoiler: il ne sera pas là ! Pourquoi ?
```

**Réponse :** Non ! Les modifications ne persistent pas car chaque `docker run` crée un nouveau container à partir de l'image de base.
</details>

## 7. Installer Docker dans le container

<details>
<summary>💡 Spoiler - Installation de Docker</summary>

```bash
# Dans le container alpine
apk add docker

# Démarrer le service docker
service docker start
```
</details>

## 8. Démarrer un container Alpine Linux dans le container Alpine Linux

<details>
<summary>💡 Spoiler - Docker dans Docker (Inception style 🎬)</summary>

```bash
# Docker dans Docker !
docker run -it alpine:latest sh
```

**Note :** Ceci nécessite des privilèges spéciaux et peut ne pas fonctionner selon la configuration.
</details>

## Concepts clés à retenir

- **Éphémère** : Les containers sont temporaires par défaut
- **Images vs Containers** : L'image est le modèle, le container est l'instance
- **Isolation** : Chaque container a son propre système de fichiers

## Questions à se poser

- Pourquoi les modifications disparaissent-elles ?
- Comment pourrait-on sauvegarder les modifications ?
- Quelle est la différence entre `apk` et `apt` ?
