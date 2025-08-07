# README de 🔥

## Commandes d'installation

Initialisez un nouveau projet Node.js avec un fichier `package.json` par défaut

```node
npm init -y
```

Installez les dépendances nécessaires : **Express** (framework web) et **uuid** (générateur d'identifiants uniques).

```node
npm install express uuid
```

Démarrez l'application en exécutant le fichier principal `index.js`

```node
node index.js
```

Vous devriez voir le message suivant :
`[INFO] API server listening on port 3000`

Ouvrez une *nouvelle* fenêtre de terminal (ne fermez pas la première).

Utilisez curl pour envoyer une requête POST à l'API. Cette requête doit inclure le drapeau -X POST pour spécifier la méthode HTTP et le drapeau -d pour envoyer le corps JSON.

```zsh
curl -X POST http://localhost:3000/deploy_script \
-H "Content-Type: application/json" \
-d '{ "script_url": "https://raw.githubusercontent.com/samuel-breton/api-gilmore/main/hello.zsh" }'
```

`curl -X POST` : Indique à `curl` d'utiliser la méthode HTTP `POST`.

`http://localhost:3000/deploy_script` : C'est l'URL de votre endpoint.

`-H "Content-Type: application/json"` : Définit l'en-tête pour indiquer que le corps de la requête est au format JSON.

`-d '{ "script_url": "..." }'` : C'est le corps JSON de la requête, qui contient l'URL de votre script ZSH.

Si tout fonctionne correctement, vous devriez voir une réponse JSON dans votre terminal, similaire à celle-ci :

```json
{"status":"success","message":"Script executed successfully.","stdout":"Hello, samuel ! The deployment was a success!\nExecuting on Jeu  7 aoû 2025 14:58:21 EDT\n","stderr":""}%
```