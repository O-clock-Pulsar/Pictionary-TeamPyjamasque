import SocketIO from 'socket.io';
import { Container } from 'typedi';
import GameService from '../services/GameService';

const gameService = Container.get(GameService);

const io: SocketIO.Server = SocketIO();

export default class Server {
    port: number;

    namespaces: Object;

    // Port type must be any to avoid problems with SocketIO types but is converted to a number when stored after activating the server
    constructor(port: any) {
      this.port = Number(port);
      this.namespaces = {};
    }

    start(): void {
      io.on('connection',
        (baseSocket: SocketIO.Socket) => {
          baseSocket.on('game start',
            (gameNamespace: string) => {
              this.namespaces[gameNamespace] = io.of(`/${gameNamespace}`);
              this.namespaces[gameNamespace].on('connection',
                async (namespaceSocket: SocketIO.Socket) => {
                  // Returns null if not enough players to start
                  const { username } = namespaceSocket.handshake.query;
                  const playerList = await gameService.addToPlayerList(gameNamespace,
                    username);
                  if (playerList.length >= 2) {
                    namespaceSocket.emit('game ready');
                  }

                  namespaceSocket.on('disconnect',
                    async () => {
                      namespaceSocket.leave('drawerer');
                      namespaceSocket.leave('answerer');

                      const remainingPlayers = await gameService.removeFromPlayerList(gameNamespace,
                        username);
                      if (remainingPlayers.length === 0) {
                        delete this.namespaces[gameNamespace];
                      } else if (remainingPlayers.length <= 2) {
                        namespaceSocket.emit('waiting for players');
                      }
                    });

                  namespaceSocket.on('become drawerer',
                    () => {
                      namespaceSocket.leave('answerers');
                      namespaceSocket.join('drawerer');
                    });

                  namespaceSocket.on('become answerer',
                    () => {
                      namespaceSocket.leave('drawerer');
                      namespaceSocket.join('answerers');
                    });

                  namespaceSocket.on('draw',
                    (image: JSON) => {
                      this.namespaces[gameNamespace].to('answerers').emit('drawed',
                        image);
                    });

                  namespaceSocket.on('answer',
                    (answer: string) => {
                      this.namespaces[gameNamespace].to('drawerer').emit('answered',
                        answer);
                    });

                  namespaceSocket.on('game end',
                    (gameNamespace: string) => {
                      namespaceSocket.leave('drawerer');
                      namespaceSocket.leave('answerer');
                      delete this.namespaces[gameNamespace];
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
