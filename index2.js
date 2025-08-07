// Fichier: index2.js

// Importation des modules nécessaires pour notre application.
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');

// Promisifie la fonction `exec` pour utiliser `async/await`,
// ce qui simplifie la gestion des opérations asynchrones.
const execPromise = promisify(exec);

// Crée une instance de l'application Express.
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les corps de requêtes JSON.
// C'est indispensable pour lire les données envoyées par 'curl -d'.
app.use(express.json());

// Endpoint principal de l'API pour déployer un script.
// Il écoute uniquement les requêtes POST.
app.post('/deploy_script', async (req, res) => {
  // 1. Validation de l'entrée et Sécurité
  const { script_url } = req.body;

  // Vérifie si l'URL du script est présente dans la requête.
  if (!script_url) {
    return res.status(400).json({ error: "L'URL du script ('script_url') est manquante dans le corps de la requête." });
  }

  // Mesure de sécurité critique : vérifie si l'URL provient de GitHub.
  // Dans un environnement de production, vous devriez créer une liste blanche
  // de domaines autorisés pour prévenir les attaques.
  const isTrustedDomain = script_url.startsWith('https://raw.githubusercontent.com/');
  if (!isTrustedDomain) {
    return res.status(403).json({ error: "URL de script invalide. Seules les URL de raw.githubusercontent.com sont autorisées." });
  }

  console.log(`[INFO] Requête reçue pour déployer le script depuis: ${script_url}`);

  // Crée un chemin de fichier temporaire unique pour stocker le script téléchargé.
  const tempDir = os.tmpdir();
  const scriptId = uuidv4();
  const tempScriptPath = path.join(tempDir, `${scriptId}.zsh`);

  try {
    // 2. Téléchargement du script ZSH depuis le dépôt GitHub public
    console.log(`[INFO] Téléchargement du script depuis ${script_url}`);
    
    // Utilise 'curl' pour télécharger le script et l'enregistrer dans le fichier temporaire.
    const fetchCommand = `curl -sSL -o ${tempScriptPath} "${script_url}"`;
    await execPromise(fetchCommand);

    // 3. Rend le script exécutable
    fs.chmodSync(tempScriptPath, '755');
    
    // 4. Exécution du script ZSH
    console.log(`[INFO] Exécution du script: ${tempScriptPath}`);
    const executionCommand = `zsh ${tempScriptPath}`;
    
    const { stdout, stderr } = await execPromise(executionCommand);
    
    console.log('[INFO] Script exécuté avec succès.');
    
    // 5. Nettoyage : supprime le fichier temporaire
    fs.unlinkSync(tempScriptPath);

    // 6. Envoie une réponse JSON avec le résultat de l'exécution
    res.status(200).json({
      status: 'success',
      message: 'Script exécuté avec succès.',
      stdout,
      stderr
    });

  } catch (error) {
    // 7. Gestion des erreurs
    console.error(`[ERROR] L'exécution du script a échoué: ${error.message}`);
    
    // S'assure que le fichier temporaire est supprimé même en cas d'erreur
    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
    }

    res.status(500).json({
      status: 'error',
      message: "Échec de l'exécution du script.",
      details: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    });
  }
});

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`[INFO] Serveur API écoutant sur le port ${PORT}`);
});