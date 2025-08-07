# Utilise une image Node.js légère comme base pour l'application.
# 'alpine' est une version très compacte, idéale pour les conteneurs.
FROM node:current-alpine AS bleeding-edge

# Crée et définit le répertoire de travail pour l'application dans le conteneur.
WORKDIR /app

# Copie les fichiers de dépendances pour installer les modules npm.
# C'est une bonne pratique pour optimiser le cache de Docker.
COPY package*.json ./

# Installe toutes les dépendances du projet.
RUN npm install

# Copie le reste des fichiers du projet dans le conteneur.
COPY . .

# Expose le port sur lequel l'application s'exécute.
EXPOSE 3000

# Commande pour démarrer l'application.
# Cette commande s'exécute lorsque le conteneur est démarré.
CMD ["node", "index.js"]