import { GameConfig } from './lobby-config';

export const SocketEvent = {
    playerJoinLobby: 'player join lobby',
    playerLeaveLobby: 'player leave lobby',
    setConfig: 'set config',
    chatMessage: 'message',
    commandMessage: 'command',
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

export interface NormalChatMessage {
    lobbyKey: string;
    playerName: string;
    message: string;
}
