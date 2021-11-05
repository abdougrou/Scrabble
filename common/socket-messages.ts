import { GameConfig } from "./lobby-config";

export const SocketEvent = {
    playerJoinLobby: 'player join lobby',
    playerLeaveLobby: 'player leave lobby',
    setConfig: 'set config'
};

export interface JoinLobbyMessage {
    lobbyKey: string;
    playerName: string;
}

export interface LeaveLobbyMessage {
    lobbyKey: string;
    playerName: string;
}

export interface SetConfigMessage {
    lobbyKey: string;
    config: GameConfig;
}
