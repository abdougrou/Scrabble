import { Objective } from '@app/classes/objective';
import { Player } from '@app/classes/player';
import { Vec2 } from '@common/vec2';
import { LobbyConfig } from './lobby-config';

export const SocketEvent = {
    playerJoinLobby: 'player join lobby',
    playerLeaveLobby: 'player leave lobby',
    deleteLobby: 'delete-lobby',
    setConfig: 'set config',
    chatMessage: 'message',
    setTimer: 'set timer',
    switchPlayers: 'switch players',
    placeLetters: 'place letters',
    exchangeLetters: 'exchange letters',
    skipTurn: 'skip turn',
    setPlayers: 'set players',
    update: 'update',
    reserve: 'reserve',
    continueSolo: 'continue solo',
};

export interface JoinLobbyMessage {
    lobbyKey: string;
    playerName: string;
}

export interface LeaveLobbyMessage {
    lobbyKey: string;
    playerName: string;
}

export interface DeleteLobbyMessage {
    lobbyKey: string;
}

export interface SetConfigMessage {
    lobbyKey: string;
    config: LobbyConfig;
    guest: string;
    players?: Player[];
    objectives?: Objective[];
}

export interface ContinueSoloMessage {
    vPlayer: Player;
    mainPlayer: Player;
}

// I dont know how it will work currently
export interface SetTimerMessage {
    lobbyKey: string;
    duration: number;
}

export interface SwitchPlayersMessage {
    lobbyKey: string;
}

export interface PlaceLettersMessage {
    lobbyKey: string;
    playerData: PlayerData;
    word: string;
    coord: Vec2;
    across: boolean;
}

export interface ExchangeLettersMessage {
    lobbyKey: string;
    playerData: PlayerData;
    letters: string;
}

export interface SkipTurnMessage {
    lobbyKey: string;
    playerData: PlayerData;
}

export interface ShowReserveMessage {
    lobbyKey: string;
}

export interface NormalChatMessage {
    lobbyKey: string;
    playerName: string;
    message: string;
}

export interface PlayerData {
    name: string;
    score: number;
    easel: string;
}

export interface UpdateMessage {
    lobbyKey: string;
}

export interface UpdateGameManagerMessage {
    players: Player[];
    reserveData: Map<string, number>;
    reserveCount: number;
    boardData: (string | null)[][];
    // turnDurationLeft: number;
}
