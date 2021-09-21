export interface GameConfig {
    playerName1: string;
    playerName2: string;
    gameMode: GameMode;
    isMultiPlayer: boolean;
    name: string;
    duration: number;
    bonusEnabled: boolean;
    dictionnary: Dictionnary;
}

export enum GameMode {
    Classic,
    LOG2990,
}

export enum Dictionnary {
    French,
    English,
}

export const DURATION_INIT = 60;
