export const SocketEvent = {
    playerJoinLobby: 'player join lobby',
    playerLeaveLobby: 'player leave lobby',
};

export interface JoinLobbyMessage {
    lobbyKey: string;
    playerName: string;
}

export interface LeaveLobbyMessage {
    lobbyKey: string;
    playerName: string;
}
