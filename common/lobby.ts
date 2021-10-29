export interface Lobby {
    key: string;
    config: LobbyConfig;
};

export interface LobbyConfig {
    host: string;
    turnDuration: number;
    bonusEnabled: boolean;
    dictionary: string;
};
