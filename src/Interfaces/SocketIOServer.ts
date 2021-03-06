export interface IInvitation {
    sender: string,
    receiver: string,
    namespace: string
}

export interface INamespaceObject {
    namespace: SocketIO.Namespace;
    connectedUsers: object;
    readyUsers: Set<string>;
    playerList: string[];
    isInProgress: boolean;
    drawer: string;
    word: string;
    timerTotal: number;
    timerSeconds: number;
    timerInterval: NodeJS.Timeout;
    stillPlaying: string[];
    exDrawers: string[];
    results: any[];
  }
