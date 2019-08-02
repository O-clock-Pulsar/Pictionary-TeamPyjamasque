# on déclare une "image de base"
FROM oclock/ts:alpha

# on doit copier les sources
COPY . /MyApp

# on installe les modules manquants
RUN npm install