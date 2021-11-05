import { Player } from "@app/classes/player";
import { Vec2 } from "@app/classes/vec2";
import { GameConfig } from "./lobby-config";

export const SocketEvent = {
    playerJoinLobby: 'player join lobby',
    playerLeaveLobby: 'player leave lobby',
    setConfig: 'set config',
    startTimer: 'start timer',
    switchPlayers: 'switch players',
    placeLetters: 'place letters',
    exchangeLetters: 'exchange letters',
    skipTurn: 'skip turn',
    setPlayers: 'set players'
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

// I dont know how it will work currently
export interface StartTimerMessage {
    lobbyKey: string;
    playerName: string;
}

export interface SwitchPlayersMessage {
    lobbyKey: string;
}

export interface PlaceLettersMessage {
    lobbyKey: string;
    player: Player;
    word: string;
    coord: Vec2;
    across: boolean;
}

export interface ExchangeLettersMessage {
    lobbyKey: string;
    player: Player;
    letters: string;
}

export interface SkipTurnMessage {
    lobbyKey: string;
    player: Player;
}

export interface SetPlayers {
    lobbyKey: string;
}
