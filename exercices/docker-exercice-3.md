# Exercice Docker 3 : Container PHP

**Objectif :** Utiliser PHP et son serveur web intégré

## 1. Démarrer un container PHP

<details>
<summary>💡 Spoiler - Commande pour démarrer PHP</summary>

```bash
docker run -it php:8.2-cli bash
```
</details>

## 2. Rentrer dans le container et exécuter le terminal 'sh'

Tu es déjà dans le container. Explore l'environnement PHP :

<details>
<summary>💡 Spoiler - Commandes d'exploration PHP</summary>

```bash
which php
ls /usr/local/bin/
```
</details>

## 3. Afficher la version de PHP dans le terminal

<details>
<summary>💡 Spoiler - Commandes pour voir PHP</summary>

```bash
php --version
php -m  # Modules installés
```
</details>

## 4. Créer un fichier .php sur ton ordinateur avec un petit code PHP

Sur ton ordinateur, crée un fichier `test-php.php` :

<details>
<summary>💡 Spoiler - Contenu du fichier PHP</summary>

```php
<?php
echo "<h1>Hello Docker depuis PHP !</h1>\n";
echo "<p>Version de PHP: " . phpversion() . "</p>\n";
echo "<p>Système: " . php_uname() . "</p>\n";

var_dump($_SERVER);

$fruits = ["pomme", "banane", "orange"];
echo "<h2>Mes fruits préférés:</h2>\n";
foreach($fruits as $fruit) {
    echo "<li>$fruit</li>\n";
}

echo "<p>Timestamp: " . date('Y-m-d H:i:s') . "</p>\n";
?>
```
</details>

## 5. Copier ce fichier dans le container Docker

<details>
<summary>💡 Spoiler - Commandes pour copier le fichier PHP</summary>

```bash
# Dans un nouveau terminal
docker ps
docker cp test-php.php <container>:/var/www/html/test-php.php
```
</details>

## 6. Démarrer le serveur web interne de PHP dans le container

<details>
<summary>💡 Spoiler - Commandes pour le serveur web</summary>

```bash
# Dans le container
cd /var/www/html
php -S 0.0.0.0:8000
```
</details>

## 🌐 Pour accéder au serveur depuis ton navigateur

<details>
<summary>💡 Spoiler - Container avec port mapping</summary>

```bash
# Dans un nouveau terminal, lance le container avec port mapping
docker run -it -p 8080:8000 php:8.2-cli bash

# Puis dans le container :
cd /var/www/html
# Copie ton fichier PHP ici (avec docker cp depuis un autre terminal)
php -S 0.0.0.0:8000

# Ouvre http://localhost:8080/test-php.php dans ton navigateur
```
</details>

## Résultat attendu

Dans ton navigateur, tu devrais voir :
- Un titre "Hello Docker depuis PHP !"
- La version de PHP
- Les informations système
- Le contenu de `$_SERVER`
- La liste des fruits
- Le timestamp actuel

## Questions à se poser

- Pourquoi utilise-t-on `-p 8080:8000` ?
- Quelle est la différence entre `php:8.2-cli` et `php:8.2-apache` ?
- Comment pourrait-on servir plusieurs fichiers PHP ?

## Bonus

Essaie de créer un fichier `info.php` avec juste `<?php phpinfo(); ?>` et accède-y via le navigateur !
