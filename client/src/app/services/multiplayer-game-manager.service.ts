import { Injectable } from '@angular/core';
import { GameMode } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { SECOND_MD } from '@app/constants';
import { DictionaryInfo } from '@common/dictionaryTemplate';
import { LobbyConfig } from '@common/lobby-config';
import { Vec2 } from '@common/vec2';
import { BehaviorSubject, timer } from 'rxjs';
import { BoardService } from './board.service';
import { CommunicationService } from './communication.service';
import { GameManagerService } from './game-manager.service';
import { GridService } from './grid.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class MultiplayerGameManagerService {
    updatePlayer: BehaviorSubject<string> = new BehaviorSubject('');
    players: Player[] = [];
    lobbyConfig: LobbyConfig;
    guestName: string;
    turnDurationLeft: number = 0;
    isEnded: boolean;
    mainPlayerName: string;
    gameMode: GameMode;
    dictionary: DictionaryInfo | string;

    isFirstTurn: boolean = true;
    endGameMessage: string = '';
    debug: boolean = false;
    mainPlayer: Player;
    gameManagerSolo?: GameManagerService;

    constructor(
        public gridService: GridService,
        public communication: CommunicationService,
        public board: BoardService,
        public reserve: ReserveService,
        public player: PlayerService,
    ) {
        this.communication.setGameManager(this);
    }

    initialize(lobbyConfig: LobbyConfig, playerName: string) {
        this.lobbyConfig = lobbyConfig;
        this.guestName = playerName;
        this.turnDurationLeft = lobbyConfig.turnDuration;
        this.isEnded = false;
        this.gameMode = lobbyConfig.gameMode;
        this.board.initialize(lobbyConfig.bonusEnabled);
        this.dictionary = lobbyConfig.dictionary;
        this.communication.update();
        this.mainPlayer = this.getMainPlayer();
        this.startTimer();
    }

    getMainPlayer(): Player {
        // const result = this.players.find((player) => player.name === this.mainPlayerName);
        // console.log(result);
        if (this.players[0].name === this.mainPlayerName) return this.players[0];
        else return this.players[1];
    }

    update() {
        this.communication.update();
        this.gridService.drawBoard();
    }

    emitChanges() {
        this.updatePlayer.next('updated');
    }

    startTimer() {
        const source = timer(0, SECOND_MD);
        source.subscribe(() => {
            this.turnDurationLeft -= 1;
            if (this.turnDurationLeft === 0) {
                this.switchPlayers();
            }
        });
    }

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
        this.communication.placeLetters(player, word, coord, vertical);
        this.gridService.drawBoard();
    }

    placeMouseLetters(word: string, coord: Vec2, vertical: boolean, player: Player) {
        this.communication.placeLetters(player, word, coord, vertical);
        this.gridService.drawBoard();
    }
}
const keyToCoord = (key: string): Vec2 => {
    const coords = key.split('.');
    return { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
};
