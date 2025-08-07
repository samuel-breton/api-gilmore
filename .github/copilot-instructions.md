# GitHub Copilot Instructions for API Gilmore

## 1. Contexte du projet
- **Objectif pédagogique** : Construire une API REST simple pour recevoir une URL de script (ZSH) et l'exécuter dans un environnement sécurisé.
- **Stack** :
  - Langage : JavaScript (Node.js 18+)
  - Framework : Express.js
  - Exécution shell : `child_process` (ou `execa`)
  - Validation des requêtes : `Joi` ou `express-validator`
  - Logs : `winston` ou un simple logger maison

## 2. Conventions de code
- **Style** : Respecter le style “Standard JS” ou “Airbnb”, selon ton choix (spécifie ici).
- **Convention de nommage** :
  - camelCase pour variables et fonctions
  - PascalCase pour les classes et constructeurs
- **Structure du projet** :
  - `index.js` → configuration Express et middleware
  - `routes/deploy.js` → route `POST /deploy_script`
  - `controllers/deployController.js` → logique métier
  - `services` → logique d’exécution/extraction/exécution sécurisée

## 3. Documentation & commentaires
- Utiliser **JSDoc** pour typer et documenter toutes les fonctions publiques.
- Générer un README clair qui explique comment lancer le projet, l’endpoint, et les requêtes curl.

## 4. Sécurité & validation
- Valider que `script_url` est une URL HTTP/HTTPS via `Joi`.
- Ajouter un token de sécurité (ex: `x-api-key` ou variable d’environnement `API_KEY`).
- Limiter la taille de la réponse et le temps d’exécution du script (`timeout: 5000 ms`).

## 5. Gestion des erreurs
- Utiliser un middleware global `errorHandler(err, req, res, next)`.
- Réponses JSON d’erreur structurées :
  ```json
  {
    "error": "Invalid URL format",
    "status": 400
  }