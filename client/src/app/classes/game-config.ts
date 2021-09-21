export class GameConfig {
    constructor(
        public gameMode: GameMode,
        public isMultiPlayer: boolean,
        public name: string,
        public duration: number,
        public bonusEnabled: boolean,
        public dictionnary: Dictionnary,
    ) {}

    clear() {
        this.name = '';
        this.duration = DURATION_INIT;
        this.bonusEnabled = false;
        this.dictionnary = Dictionnary.French;
    }
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
