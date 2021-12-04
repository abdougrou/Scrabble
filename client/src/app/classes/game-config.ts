import { DictionaryInfo } from '@common/dictionaryTemplate';

export interface GameConfig {
    playerName1: string;
    playerName2: string;
    gameMode: GameMode;
    isMultiPlayer: boolean;
    duration: number;
    bonusEnabled: boolean;
    dictionary: Dictionary | DictionaryInfo;
    expert?: boolean;
}

export enum GameMode {
    Classic,
    LOG2990,
}

export enum Dictionary {
    French,
    English,
}
