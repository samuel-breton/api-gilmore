# README de 🔥

The API and Event Model
In this context, the API is the listener. It waits for an external "event"—in your case, an HTTP POST request with a specific payload (the GitHub URL). The API's role is to receive this event and trigger the predefined action, which is to fetch and execute your ZSH script.

Building this API means writing a small, focused web server that exposes a single, secure endpoint to handle this specific action.


Step 1: Choosing Your Stack (Node.js & Express)
For a task like this, where the logic is simple and I/O-bound (fetching a file), Node.js with the Express.js framework is an excellent choice. It's fast, widely used, and has a straightforward module for executing shell commands.

Language: JavaScript (or TypeScript).

Framework: Express.js, a minimalist and flexible web application framework.

Key Module: The built-in child_process module for running shell commands.

Step 2: The API Code (Node.js & Express)
This code will set up an Express server with a single POST endpoint. It will perform the necessary steps to validate the request, fetch the script, and run it, while also handling potential errors gracefully.

You can use curl to test the API endpoint. You'll need a simple ZSH script hosted in a public GitHub repository.

The server will respond with a JSON object containing the script's output, confirming it worked.

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

La commande exécute une requête `POST` vers l’API locale pour déployer un script ZSH distant :

Elle utilise `curl` pour envoyer une requête HTTP `POST`.
L’en-tête **Content-Type** précise que le corps est en **JSON**.
Le corps de la requête contient l’URL du script ZSH à déployer.

Si l’API fonctionne, vous recevrez une réponse JSON indiquant le résultat de l’exécution du script.

```zsh
curl -sS -X POST http://localhost:3000/deploy_script \
-H "Content-Type: application/json" \
-d '{ "script_url": "https://raw.githubusercontent.com/samuel-breton/api-gilmore/main/hello.zsh" }'
```

Pour mieux lire et interpréter la réponse JSON dans votre terminal, vous pouvez utiliser l’outil **[jq](https://jqlang.or)**, qui permet de formater et colorer le JSON pour une lecture plus facile.

Ajoutez simplement | jq à la fin de votre commande :

```zsh
curl -sS -X POST http://localhost:3000/deploy_script \
-H "Content-Type: application/json" \
-d '{ "script_url": "https://raw.githubusercontent.com/samuel-breton/api-gilmore/main/hello.zsh" }' | jq
```

`curl -X POST` : Indique à `curl` d'utiliser la méthode HTTP `POST`.

`http://localhost:3000/deploy_script` : C'est l'URL de votre endpoint.

`-H "Content-Type: application/json"` : Définit l'en-tête pour indiquer que le corps de la requête est au format JSON.

`-d '{ "script_url": "..." }'` : C'est le corps JSON de la requête, qui contient l'URL de votre script ZSH.

Si tout fonctionne correctement, vous devriez voir une réponse JSON dans votre terminal, similaire à celle-ci :

```json
{"status":"success","message":"Script executed successfully.","stdout":"Hello, samuel ! The deployment was a success!\nExecuting on Jeu  7 aoû 2025 14:58:21 EDT\n","stderr":""}%
```