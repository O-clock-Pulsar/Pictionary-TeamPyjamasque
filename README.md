# O'DRAW
#### (project handled by TeamPyjamasque (O'clock project) )
## Synopsis
O'draw is an online game to play with friends or strangers. Like pictonnary but more fun, its goal is to provide a fun gaming experience.
## Dev
O'draw is currently at the MVP level for now, but many options are planned (depending on time).
## Require
To play O'draw, you only need a device (computer, smartphone....), an internet connection, and that's all.
You just need to log in (or register) and join/create a game and....
Off you go!!!
## Getting started
If it's your first time on O'draw, you have to create an account by providing an email and a username.
If you are already registered, you just have to login.
### create a game
In O'draw, you have many ways to start a game.
The easiest way is to create a game and then invite your friends. When the team is full, the game will start automaticaly.
### Search/ join a game
If you don't want to create a game, you have 2 options:
+ you can click on the "search' tool to find all the games that you can join.
+ you can wait for an invitation. If someone sends you an invitation, a little window will pop and you will be able to join the game or decline the invitation.
### Play a game
Now that you have created/joined a game, it's time to draw!
One player begins as a drawer and the other players begin as guessers. At the end of each turn, the drawer becomes a guesser and the next player becomes the drawer.
Each player will draw a least 3 times.
* When you play as a drawer:
The drawer will get a random word selected by O'draw. They will be the only one to see that word and will have to get other players to guess it by drawing on a canvas with a time limit.
The drawer will see all the answers provided by other players but won't be able to chat with them.
The drawer has a time limit to make the other players guess what they are drawing on the canvas.
If the time runs out, the turn ends and another player is picked as the drawer.
* When you play as a guesser:
While the drawer is drawing (thx Mr. Obvious), other players will see them draw live and will try to guess by typing the answer.
When a guesser types an answer, only the drawer will be able to see it.
If the guesser provides the right answer, they get points.
+ If he is the first to provide the right answer, their points increase by 3. (He wont be able to provide other answers until the end of this turn.)
+ If he provides the right answer but not first, their points increase by one. (He wont be able to provide other answer until the end of this turn.)
+ If the guesser does not provide a good answer, the score does not change
The game will end when all the players have drawn 3 times.
At the end of the game, the player with the biggest number of points wins the game and all the players will be brought back to the home page to restart a new game and have fun all over again!!
### Incoming features
O'Draw is a project in developpement and some features will be implemented after the MVP version release.
The team already has some ideas of the next features to come, but if you have some ideas, send us a message! ;)
Soon we will implement:
+ Authentification via facebook, google, others...
+ A profile dashboard that allowes you to modify information or have an avatar
+ The possibility to pick a word in a list before drawing
+ A friend list
+ A chatbox
+ Modify the game timer
+ Choose the level of difficulty of the word list
+ Save drawings
+ And more!

## Contact the Pyjamasque team
Adam Wier: wier.adam (at) gmail.com

## Installation de githooks
Dans la racine du projet, executer `node git-hooks/init` pour copier les git hooks dans le bon dossier.

## Comment utiliser le React App
### En dev
Pour utiliser le côté react en mode développement, il faut se placer dans le dossier ./react-app et lancer `npm run start`. Le server node basculera automatiquement sur le server react, qui est sur la porte 3000.

### En prod
Lancer la commande `npm run build` lancera automatiquement la commande `npm run build` dans le dossier react. Elle a été modifié pour vider les anciens builds de react avant de déplacer le dossier react dans le dossier public du server node avant de lancer la compilation du typecript.
Avant de lancer `npm run build`, il faut mettre `INLINE_RUNTIME_CHUNK=false` dans le fichier .env trouvé dans /react-app pour que ça passe avec Helmet (qui bloque les in-line scripts).
Egalement, on doit mettre un .env dans le dossier dist avec la valeur `NODE_ENV=production` pour gérer la différence en routage entre l'environement dev et l'environment prod.
D'autres valeurs à ajouté au fichier .env selon besoin sont:

#### .env React (avant build)
INLINE_RUNTIME_CHUNK

#### .env Node (pris en compte au démarrage)
NODE_ENV
PORT
SOCKET_IO_ADDRESS_WS_PROTOCOL
SOCKET_IO_ADDRESS_HTTP_PROTOCOL
SOCKET_IO_PORT
MONGODB_URI
JWT_SECRET
COOKIE_SECRET
SESSION_SECRET
SESSION_NAME
SALT_ROUNDS
ADJ_NOUN_SEED
