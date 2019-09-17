import SocketIO from 'socket.io';

const io: SocketIO.Server = SocketIO();

export default class Server {

    port: number;
    namespaces: Object;

    // Port type must be any to avoid problems with SocketIO types but is converted to a number when stored after activating the server
    constructor(port: any){
        this.port = Number(port);
        this.namespaces = {};
    }

    start(): void {
        io.on('connection', (baseSocket: SocketIO.Socket) => {

            baseSocket.on("game start", (gameNamespace: string) => {
                this.namespaces[gameNamespace] = io.of('/' + gameNamespace);
                this.namespaces[gameNamespace].on('connection', (namespaceSocket: SocketIO.Socket) => {

                    namespaceSocket.on('become drawerer', () =>{
                        namespaceSocket.leave("answerers");
                        namespaceSocket.join("drawerer");
                    });

                    namespaceSocket.on('become answerer', () =>{
                        namespaceSocket.leave("drawerer");
                        namespaceSocket.join("answerers");
                    })

                    namespaceSocket.on('draw', (image: JSON) => {
                        this.namespaces[gameNamespace].to('answerers').emit('drawed', image);
                    });
        
                    namespaceSocket.on('answer', (answer: string) => {
                        this.namespaces[gameNamespace].to('drawerer').emit('answered', answer);
                    });
        
                    namespaceSocket.on("game end", (gameNamespace: string) => {
                        namespaceSocket.leave('drawerer');
                        namespaceSocket.leave('answerer');
                        delete this.namespaces[gameNamespace];
                    });

                });
            });
            
        });

        try {
            io.listen(this.port);
            console.log("Socket IO Server started");
        } catch (e) {console.log(e)}
        
    };
};