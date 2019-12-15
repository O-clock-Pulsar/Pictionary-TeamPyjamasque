import SocketIO from 'socket.io';
import { Container } from 'typedi';
import GameService from '../services/GameService';
import { Invitation } from '../Interfaces/SocketIOServer';

const gameService = Container.get(GameService);

export default class Server {
  server: any;

  io: any;

  namespaces: Object;

  connectedUsers: Object;

  // Port type must be any to avoid problems with SocketIO types but is converted to a number when stored after activating the server
  constructor(server: any) {
    this.server = server;
    this.namespaces = {};
    this.connectedUsers = {};
    this.io = SocketIO();
  }

  createNamespace(gameNamespace: string): void {
    this.namespaces[gameNamespace] = this.io.of(`/${gameNamespace}`);
    this.namespaces[gameNamespace].connectedUsers = {};
    this.namespaces[gameNamespace].readyUsers = new Set();
    this.namespaces[gameNamespace].playerList;
    this.namespaces[gameNamespace].isInProgress = false;
    this.namespaces[gameNamespace].drawerer = '';
    this.namespaces[gameNamespace].word = '';
    this.namespaces[gameNamespace].timerSeconds = 180;
    this.namespaces[gameNamespace].timerInterval;

    this.namespaces[gameNamespace].on('connection',
      async (namespaceSocket: SocketIO.Socket): Promise<void> => {
        const { username } = namespaceSocket.handshake.query;

        this.namespaces[gameNamespace].connectedUsers[username] = namespaceSocket.id;

        const playerResults = await gameService.addToPlayerList(gameNamespace,
          username);
        if (!this.namespaces[gameNamespace].isInProgress && playerResults.ready) {
          this.namespaces[gameNamespace].playerList = playerResults.playerList;
          this.io.of(gameNamespace).emit('game ready');
        } else if (this.namespaces[gameNamespace].isInProgress) {
          this.io.of(gameNamespace).emit('game start',
            this.namespaces[gameNamespace].timerSeconds);
          if (username === this.namespaces[gameNamespace].drawerer) {
            const drawererSocketId = this.namespaces[gameNamespace].connectedUsers[this.namespaces[gameNamespace].drawerer];
            this.io.of(gameNamespace).to(drawererSocketId).emit('receive word',
              this.namespaces[gameNamespace].word);
            this.io.of(gameNamespace).to(this.namespaces[gameNamespace].connectedUsers[username]).emit('become drawerer');
          } else {
            this.io.of(gameNamespace).to(this.namespaces[gameNamespace].connectedUsers[username]).emit('become answerer');
          }
        }

        namespaceSocket.on('disconnect',
          async (): Promise<void> => {
            namespaceSocket.leave('drawerer');
            namespaceSocket.leave('answerer');

            delete this.namespaces[gameNamespace].connectedUsers[username];

            const playerResults = await gameService.removeFromPlayerList(gameNamespace,
              username);
            if (playerResults.playerList.length === 0 && process.env.NODE_ENV === 'production') {
              // Nod env check added to make testing in development easier for when react reloads after changes. Possibly remove later?
              delete this.namespaces[gameNamespace];
              gameService.endGame(gameNamespace);
            }
          });

        namespaceSocket.on('player ready',
          async (username) => {
            this.namespaces[gameNamespace].readyUsers.add(username);
            if (this.namespaces[gameNamespace].readyUsers.size === this.namespaces[gameNamespace].playerList.length) {
              const players = this.namespaces[gameNamespace].playerList;
              const drawerer = players[Math.floor(Math.random() * players.length)];
              this.namespaces[gameNamespace].drawerer = drawerer;
              const drawererSocketId = this.namespaces[gameNamespace].connectedUsers[drawerer];
              const { word } = await gameService.getRoundWord();
              this.namespaces[gameNamespace].word = word;
              this.namespaces[gameNamespace].isInProgress = true;
              this.io.of(gameNamespace).emit('game start',
                this.namespaces[gameNamespace].timerSeconds);
              if (!this.namespaces[gameNamespace].timerInterval) {
                this.namespaces[gameNamespace].timerInterval = setInterval(() => {
                  this.namespaces[gameNamespace].timerSeconds -= 1;
                  if (this.namespaces[gameNamespace].timerSeconds === 0) {
                    namespaceSocket.emit('round end');
                    clearInterval(this.namespaces[gameNamespace].timerInterval);
                  }
                },
                1000);
              }
              this.io.of(gameNamespace).to(drawererSocketId).emit('receive word',
                word);
              players.forEach((player: string): void => {
                if (player === drawerer) {
                  this.io.of(gameNamespace).to(this.namespaces[gameNamespace].connectedUsers[player]).emit('become drawerer');
                } else {
                  this.io.of(gameNamespace).to(this.namespaces[gameNamespace].connectedUsers[player]).emit('become answerer');
                }
              });
            } else {
              namespaceSocket.emit('waiting');
            }
          });

        namespaceSocket.on('became drawerer',
          (): void => {
            namespaceSocket.leave('answerers');
            namespaceSocket.join('drawerer');
            namespaceSocket.emit('set drawerer interface');
          });

        namespaceSocket.on('became answerer',
          (): void => {
            namespaceSocket.leave('drawerer');
            namespaceSocket.join('answerers');
          });

        namespaceSocket.on('draw',
          (image: JSON): void => {
            this.namespaces[gameNamespace].to('answerers').emit('drawed',
              image);
          });

        namespaceSocket.on('answer',
          (answer: string): void => {
            this.namespaces[gameNamespace].to('drawerer').emit('answered',
              answer);
          });

        namespaceSocket.on('game end',
          (gameNamespace: string): void => {
            namespaceSocket.leave('drawerer');
            namespaceSocket.leave('answerer');
            delete this.namespaces[gameNamespace];
            gameService.endGame(gameNamespace);
          });
      });
  }

  start(): void {
    try {
      this.io.on('connection',
        (baseSocket: SocketIO.Socket): void => {
          const { username } = baseSocket.handshake.query;
          this.connectedUsers[username] = baseSocket.id;

          baseSocket.on('disconnect',
            () => {
              delete this.connectedUsers[username];
            });

          baseSocket.on('sendInvitation',
            (invitation: Invitation): void => {
              const playerSocketId = this.connectedUsers[invitation.receiver];
              if (playerSocketId) {
                this.io.to(playerSocketId).emit('invite',
                  invitation);
                baseSocket.emit('invitationSuccess');
              } else {
                baseSocket.emit('invitationFail');
              }
            });
        });

      this.io.listen(this.server);
      console.log('Socket IO Server started');
    } catch (e) { console.log(e); }
  }
}
