import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { LobbyConfig } from '@common/lobby-config';
import { CommunicationService } from './communication.service';
import { GridService } from './grid.service';

@Injectable({
    providedIn: 'root',
})
export class MultiplayerGameManagerService {
    players: Player[];
    turnDuration: number;
    currentTurnDurationLeft: number;
    randomPlayerNameIndex: number;
    isFirstTurn: boolean = true;
    mainPlayerName: string;
    enemyPlayerName: string;
    isEnded: boolean;
    endGameMessage: string = '';
    debug: boolean = false;
    constructor(private gridService: GridService, private communication: CommunicationService) {}

    initialize(lobbyConfig: LobbyConfig, playerName: string) {
        this.mainPlayerName = lobbyConfig.host;
        this.enemyPlayerName = playerName;
        this.turnDuration = lobbyConfig.turnDuration;
        this.currentTurnDurationLeft = lobbyConfig.turnDuration;
        this.isEnded = false;
        this.players = this.communication.getPlayers();
        this.startTimer();
    }

    startTimer() {
        this.communication.startTimer();
    }

    switchPlayers() {
        this.communication.switchPlayers();
    }

    exchangeLetters(letters: string, player: Player): string {
        this.communication.exchangeLetters(letters, player);
    }

    giveTiles(player: Player, amount: number) {}

    skipTurn() {
        this.communication.skipTurn(this.players[0]);
    }

    // TODO implement stopTimer() to end the game after 6 skipTurn
    endGame() {}

    activateDebug(): string {}

    placeLetters(word: string, coordStr: string, vertical: boolean, player: Player): PassResult {
        const coord: Vec2 = keyToCoord(coordStr);
        this.communication.placeLetters(player, word, coord, !vertical);
    }
}
const keyToCoord = (key: string): Vec2 => {
    const coords = key.split('.');
    return { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
};
