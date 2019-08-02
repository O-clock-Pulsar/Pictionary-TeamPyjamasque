# on commence avec un environnement nodeJS
FROM node:12.4.0-alpine

# on copie le code source local dans l'image
COPY . /MyApp

# on va se placer dans le répertoire qu'on vient de créer
WORKDIR /MyApp

# on installe les node_modules
RUN npm install

# un ENTRYPOINT+CMD pour lancer le tout
ENTRYPOINT ["npm"]
CMD ["run", "dev"]