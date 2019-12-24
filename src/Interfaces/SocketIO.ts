export interface INamespaceObject {
  namespace: SocketIO.Namespace;
  connectedUsers: object;
  readyUsers: Set<string>;
  playerList: string[];
  isInProgress: boolean;
  drawerer: string;
  word: string;
  timerSeconds: number;
  timerInterval: NodeJS.Timeout
}
