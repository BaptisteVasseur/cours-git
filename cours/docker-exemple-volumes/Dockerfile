# Dockerfile SANS volumes (pour comparaison)
FROM node:18-alpine

WORKDIR /app

# Copie TOUT le code dans l'image
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Utilise nodemon pour le développement
CMD ["npm", "run", "dev"]

# PROBLÈME: Si vous modifiez le code, il faut rebuilder l'image!
# Les changements ne sont PAS reflétés automatiquement
# Les données dans /app/data et /app/logs sont perdues à chaque rebuild
