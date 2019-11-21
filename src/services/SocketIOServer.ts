import SocketIO from 'socket.io';
import { Container } from 'typedi';
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
          this.connectedUsers[username] = baseSocket;

          baseSocket.on('disconnect',
            () => {
              delete this.connectedUsers[username];
            });

          baseSocket.on('sendInvitation',
            (invitation: Invitation): void => {
              const playerSocket = this.connectedUsers[invitation.receiver];
              if (playerSocket) {
                io.to(playerSocket).emit('invite',
                  invitation.namespace);
                baseSocket.emit('invitationSuccess');
              } else {
                baseSocket.emit('invitationFail');
              }
            });

          baseSocket.on('game start',
            (gameNamespace: string): void => {
              this.namespaces[gameNamespace] = io.of(`/${gameNamespace}`);
              this.namespaces[gameNamespace].connectedUsers = {};
              this.namespaces[gameNamespace].on('connection',
                async (namespaceSocket: SocketIO.Socket): Promise<void> => {
                  // Returns null if not enough players to start
                  const { username } = namespaceSocket.handshake.query;

                  this.namespaces[gameNamespace].connectedUsers[username] = namespaceSocket;

                  const playerResults = await gameService.addToPlayerList(gameNamespace,
                    username);
                  if (playerResults.ready) {
                    namespaceSocket.emit('game ready');
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
                        namespaceSocket.emit('waiting for players');
                      }
                    });

                  namespaceSocket.on('become drawerer',
                    (): void => {
                      namespaceSocket.leave('answerers');
                      namespaceSocket.join('drawerer');
                    });

                  namespaceSocket.on('become answerer',
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
