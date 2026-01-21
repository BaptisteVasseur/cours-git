# TP Docker 5 : CI/CD avec GitHub Actions et Vercel

**Objectif :** Mettre en place un pipeline CI/CD complet qui teste, build et déploie automatiquement ton application sur Vercel à chaque push.

## Mission 1 : Préparer ton projet pour le déploiement

### Étape 1 : Adapter ton application
1. Reprends ton projet de l'exercice 4 (ou crée-en un nouveau)
2. Transforme-le en application web statique ou Next.js
3. Ajoute une page d'accueil avec quelques informations sur ton app
4. Assure-toi que ton app peut être buildée pour la production

### Étape 2 : Créer un repository GitHub
1. Crée un nouveau repository sur GitHub
2. Pousse ton code sur ce repository
3. Assure-toi que ton `package.json` contient les scripts nécessaires

**Questions :**
- Quels scripts npm sont nécessaires pour un déploiement ?
- Comment Vercel détecte-t-il le type de projet à déployer ?

## Mission 2 : Configurer Vercel

### Étape 1 : Créer un compte Vercel
1. Va sur [vercel.com](https://vercel.com) et crée un compte
2. Connecte ton compte GitHub à Vercel
3. Importe ton repository dans Vercel

### Étape 2 : Premier déploiement manuel
1. Configure les paramètres de build si nécessaire
2. Lance un premier déploiement
3. Teste que ton application fonctionne en ligne

**Questions :**
- Quelle URL Vercel a-t-il généré pour ton app ?
- Que se passe-t-il si tu push du nouveau code maintenant ?

<details>
<summary>💡 Tips pour Vercel</summary>

- Vercel détecte automatiquement le framework (React, Next.js, etc.)
- Par défaut, il build avec `npm run build` et sert depuis `dist/` ou `build/`
- Tu peux personnaliser les commandes dans les paramètres du projet
</details>

## Mission 3 : Créer le workflow GitHub Actions

### Étape 1 : Structure du workflow
Crée un fichier `.github/workflows/ci-cd.yml` qui doit :
1. Se déclencher sur les push vers `main` et les pull requests
2. Avoir 3 jobs : `test`, `build`, et `deploy`
3. Utiliser les bonnes dépendances entre jobs

### Étape 2 : Job de tests
Le job `test` doit :
- Utiliser Node.js 18
- Installer les dépendances
- Lancer les tests (même si tu n'en as pas encore)
- Vérifier la qualité du code (linter)

### Étape 3 : Job de build
Le job `build` doit :
- Dépendre du job `test`
- Builder l'application
- Sauvegarder les artifacts de build

### Étape 4 : Job de déploiement
Le job `deploy` doit :
- Dépendre du job `build`
- Se déclencher seulement sur la branche `main`
- Déployer sur Vercel

**Questions :**
- Pourquoi séparer les jobs au lieu de tout faire dans un seul ?
- Comment empêcher le déploiement si les tests échouent ?
- Quelles informations sensibles faut-il stocker dans les secrets GitHub ?

<details>
<summary>💡 Tips pour GitHub Actions</summary>

**Structure de base :**
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    # ...
  build:
    needs: test
    # ...
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    # ...
```

**Secrets nécessaires :**
- `VERCEL_TOKEN` : Token d'API Vercel
- `VERCEL_ORG_ID` : ID de ton organisation Vercel
- `VERCEL_PROJECT_ID` : ID de ton projet Vercel
</details>

## Mission 4 : Configurer les secrets

### Étape 1 : Récupérer les informations Vercel
1. Installe Vercel CLI : `npm i -g vercel`
2. Connecte-toi : `vercel login`
3. Dans ton projet : `vercel link`
4. Récupère ton token : va dans Vercel Dashboard > Settings > Tokens

### Étape 2 : Configurer les secrets GitHub
1. Va dans ton repo GitHub > Settings > Secrets and variables > Actions
2. Ajoute les secrets nécessaires pour Vercel
3. Teste que tes secrets sont bien configurés

**Questions :**
- Où trouves-tu l'ORG_ID et PROJECT_ID ?
- Pourquoi ne pas mettre ces informations directement dans le code ?

<details>
<summary>💡 Tips pour les secrets</summary>

**Récupérer les IDs :**
```bash
# Dans ton projet local
vercel link
cat .vercel/project.json
```

**Sécurité :**
- Ne jamais commiter de tokens dans le code
- Utiliser des tokens avec permissions minimales
- Régénérer les tokens régulièrement
</details>

## Mission 5 : Implémenter le déploiement Vercel

### Étape 1 : Action de déploiement
Utilise l'action officielle Vercel ou configure Vercel CLI dans ton workflow.

### Étape 2 : Gestion des environnements
Configure différents environnements :
- Preview pour les pull requests
- Production pour la branche main

### Étape 3 : Tests du pipeline
1. Crée une pull request avec une petite modification
2. Vérifie que les tests passent et qu'un déploiement preview est créé
3. Merge la PR et vérifie le déploiement en production

**Questions :**
- Quelle est la différence entre un déploiement preview et production ?
- Comment rollback si le déploiement pose problème ?

<details>
<summary>💡 Tips pour le déploiement</summary>

**Action Vercel officielle :**
```yaml
- uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Déploiement conditionnel :**
- PR → Preview deployment
- Main → Production deployment
</details>

## Mission 6 : Optimisations et monitoring

### Étape 1 : Optimiser le workflow
1. Ajoute du cache pour les dépendances npm
2. Parallélise ce qui peut l'être
3. Ajoute des notifications en cas d'échec

### Étape 2 : Monitoring et alertes
1. Configure des notifications Slack/Discord (optionnel)
2. Ajoute des checks de santé après déploiement
3. Configure des métriques de performance

### Étape 3 : Documentation
1. Ajoute un README expliquant le processus de déploiement
2. Documente les variables d'environnement nécessaires
3. Crée un guide de contribution pour ton équipe

**Questions :**
- Comment savoir si ton déploiement s'est bien passé ?
- Que faire si le site est en ligne mais ne fonctionne pas correctement ?

## Validation de ton TP

### Checklist de réussite
- [ ] Application déployée automatiquement sur Vercel
- [ ] Tests qui passent avant chaque déploiement
- [ ] Déploiements preview sur les pull requests
- [ ] Déploiement production sur merge vers main
- [ ] Secrets correctement configurés
- [ ] Workflow qui échoue si les tests échouent
- [ ] Documentation du processus

### Questions de validation
1. Que se passe-t-il quand tu push du code cassé ?
2. Comment créer un déploiement preview pour tester ?
3. Où voir les logs si le déploiement échoue ?
4. Comment rollback vers une version précédente ?
5. Quels sont les avantages du CI/CD par rapport au déploiement manuel ?

### Prochaines étapes
- Explore d'autres plateformes de déploiement (Netlify, Railway, etc.)
- Apprends Docker en production avec des orchestrateurs (Kubernetes)
- Découvre les pratiques DevOps avancées (monitoring, observabilité)
- Intègre des outils de qualité code (SonarQube, CodeClimate)

### Ressources utiles
- [Documentation Vercel](https://vercel.com/docs)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Best practices CI/CD](https://docs.github.com/en/actions/learn-github-actions/essential-features-of-github-actions)
