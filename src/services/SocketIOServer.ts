import SocketIO from 'socket.io';
import { Container } from 'typedi';
import GameService from '../services/GameService';
import { IInvitation, INamespaceObject } from '../Interfaces/SocketIOServer';

const gameService = Container.get(GameService);

export default class Server {
  server: any;

  io: SocketIO.Server;

  namespaces: object;

  connectedUsers: object;

  // Port type must be any to avoid problems with SocketIO types but is converted to a number when stored after activating the server
  constructor(server: any) {
    this.server = server;
    this.namespaces = {};
    this.connectedUsers = {};
    this.io = SocketIO();
  }

  createNamespace(gameNamespace: string): void {
    const namespaceObject: INamespaceObject = {
      namespace: this.io.of(`/${gameNamespace}`),
      connectedUsers: {},
      readyUsers: new Set(),
      playerList: [],
      isInProgress: false,
      drawer: '',
      word: '',
      timerSeconds: 180,
      timerInterval: null,
    };

    namespaceObject.namespace.on('connection',
      async (namespaceSocket: SocketIO.Socket): Promise<void> => {
        const { username } = namespaceSocket.handshake.query;
        namespaceObject.connectedUsers[username] = namespaceSocket.id;

        const playerResults = await gameService.addToPlayerList(gameNamespace,
          username);

        if (playerResults.ready && !namespaceObject.isInProgress) {
          namespaceObject.playerList = playerResults.playerList;
          this.io.of(gameNamespace).emit('game ready');
        } else if (namespaceObject.isInProgress) {
          this.joinInProgress(gameNamespace,
            namespaceObject,
            username);
        }

        namespaceSocket.on('disconnect',
          async (): Promise<void> => {
            namespaceSocket.leave('drawer');
            namespaceSocket.leave('answerer');

            delete namespaceObject.connectedUsers[username];

            const playerResults = await gameService.removeFromPlayerList(gameNamespace,
              username);
            if (playerResults.playerList.length === 0) {
              delete this.namespaces[gameNamespace];
              gameService.endGame(gameNamespace,
                namespaceObject.playerList);
            }
          });

        namespaceSocket.on('player ready',
          async (username) => {
            namespaceObject.readyUsers.add(username);
            if (namespaceObject.readyUsers.size === namespaceObject.playerList.length) {
              this.setUpGame(gameNamespace,
                namespaceObject);
            } else {
              namespaceSocket.emit('waiting');
            }
          });

        namespaceSocket.on('became drawer',
          (): void => {
            namespaceSocket.leave('answerers');
            namespaceSocket.join('drawer');
            namespaceSocket.emit('set drawer interface');
          });

        namespaceSocket.on('became answerer',
          (): void => {
            namespaceSocket.leave('drawer');
            namespaceSocket.join('answerers');
          });

        namespaceSocket.on('draw',
          (image: JSON): void => {
            namespaceObject.namespace.to('answerers').emit('drawed',
              image);
          });

        namespaceSocket.on('answer',
          (answer: string): void => {
            namespaceObject.namespace.to('drawer').emit('answered',
              answer);
          });

        namespaceSocket.on('game end',
          (gameNamespace: string): void => {
            namespaceSocket.leave('drawer');
            namespaceSocket.leave('answerer');
            delete this.namespaces[gameNamespace];
            gameService.endGame(gameNamespace,
              namespaceObject.playerList);
          });
      });
    this.namespaces[gameNamespace] = namespaceObject;
  }

  async setUpGame(gameNamespace: string, namespaceObject: INamespaceObject): Promise<void> {
    const drawer = await gameService.chooseDrawer(gameNamespace);
    namespaceObject.drawer = drawer;
    const drawerSocketId = namespaceObject.connectedUsers[drawer];
    const word = await gameService.getRoundWord();
    namespaceObject.word = word;
    namespaceObject.isInProgress = true;
    this.io.of(gameNamespace).emit('game start',
      namespaceObject.timerSeconds);
    if (!namespaceObject.timerInterval) {
      namespaceObject.timerInterval = setInterval(() => {
        namespaceObject.timerSeconds -= 1;
        if (namespaceObject.timerSeconds === 0) {
          this.io.of(gameNamespace).emit('round end');
          clearInterval(namespaceObject.timerInterval);
        }
      },
      1000);
    }
    this.io.of(gameNamespace).to(drawerSocketId).emit('receive word',
      word);
    namespaceObject.playerList.forEach((player: string): void => {
      if (player === drawer) {
        this.io.of(gameNamespace).to(namespaceObject.connectedUsers[player]).emit('become drawer');
      } else {
        this.io.of(gameNamespace).to(namespaceObject.connectedUsers[player]).emit('become answerer');
      }
    });
  }

  joinInProgress(gameNamespace: string, namespaceObject: INamespaceObject, username: string): void {
    this.io.of(gameNamespace).emit('game start',
      namespaceObject.timerSeconds);
    if (username === namespaceObject.drawer) {
      const drawerSocketId = namespaceObject.connectedUsers[namespaceObject.drawer];
      this.io.of(gameNamespace).to(drawerSocketId).emit('receive word',
        namespaceObject.word);
      this.io.of(gameNamespace).to(namespaceObject.connectedUsers[username]).emit('become drawer');
    } else {
      this.io.of(gameNamespace).to(namespaceObject.connectedUsers[username]).emit('become answerer');
    }
  }

  async start(): Promise<void> {
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
            (invitation: IInvitation): void => {
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

      // Creates namespaces for games in progress in case of server crash/restart
      const currentGames = await gameService.getCurrentGames();
      currentGames.forEach((game) => { this.createNamespace(game.namespace); });

      console.log('Socket IO Server started');
    } catch (e) { console.log(e); }
  }
}
