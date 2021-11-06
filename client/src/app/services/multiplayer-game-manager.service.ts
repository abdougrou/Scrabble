import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { LobbyConfig } from '@common/lobby-config';
import { BoardService } from './board.service';
import { CommunicationService } from './communication.service';
import { GridService } from './grid.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class MultiplayerGameManagerService {
    players: Player[];
    turnDuration: number;
    turnDurationLeft: number;
    randomPlayerNameIndex: number;
    isFirstTurn: boolean = true;
    mainPlayerName: string;
    enemyPlayerName: string;
    isEnded: boolean;
    endGameMessage: string = '';
    debug: boolean = false;
    constructor(
        private gridService: GridService,
        private communication: CommunicationService,
        public board: BoardService,
        public reserve: ReserveService,
    ) {
        this.communication.setGameManager(this);
    }

    initialize(lobbyConfig: LobbyConfig, playerName: string) {
        this.mainPlayerName = lobbyConfig.host;
        this.enemyPlayerName = playerName;
        this.turnDuration = lobbyConfig.turnDuration;
        this.turnDurationLeft = lobbyConfig.turnDuration;
        this.isEnded = false;
        this.communication.update();
        // this.startTimer();
    }

    update() {
        this.communication.update();
    }

    // startTimer() {
    //     this.communication.startTimer();
    // }

    switchPlayers() {
        this.communication.switchPlayers();
    }

    exchangeLetters(letters: string, player: Player) {
        this.communication.exchangeLetters(letters, player);
    }

    skipTurn() {
        this.communication.skipTurn(this.players[0]);
    }

    // TODO implement stopTimer() to end the game after 6 skipTurn
    // endGame() {}

    // activateDebug(): string {}

    placeLetters(word: string, coordStr: string, vertical: boolean, player: Player) {
        const coord: Vec2 = keyToCoord(coordStr);
        this.communication.placeLetters(player, word, coord, !vertical);
        this.gridService.drawBoard();
    }
}
const keyToCoord = (key: string): Vec2 => {
    const coords = key.split('.');
    return { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
};
