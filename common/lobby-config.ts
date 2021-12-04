import { DictionaryInfo } from "./dictionaryTemplate";

export interface LobbyConfig {
    key?: string;
    host: string;
    turnDuration: number;
    bonusEnabled: boolean;
    dictionary: string | DictionaryInfo;
    gameMode: GameMode;
}

export interface GameConfig {
    playerName1: string;
    playerName2: string;
    gameMode: GameMode;
    isMultiPlayer: boolean;
    duration: number;
    bonusEnabled: boolean;
    dictionary: Dictionary;
}

export enum GameMode {
    Classic,
    LOG2990,
}

export enum Dictionary {
    French,
    English,
}

