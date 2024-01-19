FROM node:20-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY client ./client
COPY server ./server
COPY package.json package-lock.json .
COPY extract-version-info.js git-commit-hash.txt .
RUN npm install
RUN npm run build
RUN npm prune
EXPOSE 8000
CMD [ "npm", "start" ]