import SocketIO from 'socket.io';
import { Container } from 'typedi';
import { finished } from 'stream';
import { Db } from 'mongodb';
import { token } from 'morgan';
import bcrypt from 'bcrypt';
import GameService from '../services/GameService';
import { Invitation } from '../Interfaces/SocketIOServer';

const gameService = Container.get(GameService);

const io: SocketIO.Server = SocketIO();

export default class Server {
    port: number;

    namespaces: Object;

    connectedUsers: Object;

    // Port type must be any to avoid problems with SocketIO types but is converted to a number when stored after activating the server
    constructor(port: any) {
      this.port = Number(port);
      this.namespaces = {};
      this.connectedUsers = {};
    }

    start(): void {
      io.on('connection',
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
                io.to(playerSocketId).emit('invite',
                  invitation);
                baseSocket.emit('invitationSuccess');
              } else {
                baseSocket.emit('invitationFail');
              }
            });

          baseSocket.on('game start',
            (gameNamespace: string): void => {
              this.namespaces[gameNamespace] = io.of(`/${gameNamespace}`);
              this.namespaces[gameNamespace].connectedUsers = {};
              this.namespaces[gameNamespace].readyUsers = new Set();
              this.namespaces[gameNamespace].playerList;

              this.namespaces[gameNamespace].on('connection',
                async (namespaceSocket: SocketIO.Socket): Promise<void> => {
                  // Returns null if not enough players to start
                  const { username } = namespaceSocket.handshake.query;

                  this.namespaces[gameNamespace].connectedUsers[username] = namespaceSocket.id;

                  const playerResults = await gameService.addToPlayerList(gameNamespace,
                    username);
                  if (playerResults.ready) {
                    this.namespaces[gameNamespace].playerList = playerResults.playerList;
                    io.of(gameNamespace).emit('game ready');
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
                      } else if (!playerResults.ready) {
                        io.of(gameNamespace).emit('waiting for players');
                      }
                    });

                  namespaceSocket.on('player ready',
                    async (username) => {
                      this.namespaces[gameNamespace].readyUsers.add(username);
                      if (this.namespaces[gameNamespace].readyUsers.size === this.namespaces[gameNamespace].playerList.length) {
                        const players = this.namespaces[gameNamespace].playerList;
                        const drawerer = players[Math.floor(Math.random() * players.length)];
                        const drawererSocketId = this.namespaces[gameNamespace].connectedUsers[drawerer];
                        const word = await gameService.getRoundWord();
                        io.of(gameNamespace).emit('game start');
                        io.of(gameNamespace).to(drawererSocketId).emit('receive word',
                          word);
                      }
                    });

                  namespaceSocket.on('became drawerer',
                    (): void => {
                      namespaceSocket.leave('answerers');
                      namespaceSocket.join('drawerer');
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
            });
        });

      try {
        io.listen(this.port);
        console.log('Socket IO Server started');
      } catch (e) { console.log(e); }
    }
}
