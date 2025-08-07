// File: index.js

// Import necessary modules
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');

// Promisify the `exec` function for easier async/await handling
const execPromise = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Main API endpoint to deploy a script
// This endpoint expects a JSON body with a 'script_url' key
app.post('/deploy_script', async (req, res) => {
  // 1. Input Validation and Security
  const { script_url } = req.body;

  if (!script_url) {
    return res.status(400).json({ error: "Missing 'script_url' in request body." });
  }

  // A critical security measure: whitelist allowed domains.
  // Never allow arbitrary URLs in a production environment.
  const isTrustedDomain = script_url.startsWith('https://raw.githubusercontent.com/');
  if (!isTrustedDomain) {
    return res.status(403).json({ error: "Invalid script URL. Only scripts from raw.githubusercontent.com are allowed." });
  }

  console.log(`[INFO] Received request to deploy script from: ${script_url}`);

  // Create a temporary file path with a unique identifier
  const tempDir = os.tmpdir();
  const scriptId = uuidv4();
  const tempScriptPath = path.join(tempDir, `${scriptId}.zsh`);

  try {
    // 2. Fetch the ZSH script from the public GitHub repo
    console.log(`[INFO] Fetching script from ${script_url}`);
    
    // Use curl to fetch the script and save it to the temporary file
    const fetchCommand = `curl -sSL -o ${tempScriptPath} "${script_url}"`;
    await execPromise(fetchCommand);

    // 3. Make the script executable
    fs.chmodSync(tempScriptPath, '755');
    
    // 4. Execute the ZSH script using the `zsh` interpreter
    console.log(`[INFO] Executing script: ${tempScriptPath}`);
    const executionCommand = `zsh ${tempScriptPath}`;
    
    const { stdout, stderr } = await execPromise(executionCommand);
    
    console.log('[INFO] Le script s\'est exécuté avec succès.');
    
    // 5. Clean up the temporary file
    fs.unlinkSync(tempScriptPath);

    // 6. Return the script's output in the response
    res.status(200).json({
      status: 'success',
      message: 'Le script s\'est exécuté avec succès.',
      stdout,
      stderr
    });

  } catch (error) {
    // 7. Handle errors (e.g., failed fetch, script execution errors)
    console.error(`[ERROR] Script execution failed: ${error.message}`);
    
    // Ensure the temporary file is removed even on failure
    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to execute the script.',
      details: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`[INFO] API server listening on port ${PORT}`);
});