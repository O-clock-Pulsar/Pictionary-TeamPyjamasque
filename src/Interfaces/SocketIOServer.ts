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
    timerSeconds: number;
    timerInterval: NodeJS.Timeout
  }
