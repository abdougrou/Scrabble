import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { FIRST_PLAYER_COIN_FLIP, GRID_SIZE, MAX_SKIP_COUNT, SECOND_MD, STARTING_TILE_AMOUNT } from '@app/constants';
import { Subscription, timer } from 'rxjs';
import { BoardService } from './board.service';
import { GridService } from './grid.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    turnDuration: number;
    currentTurnDurationLeft: number;
    subscription: Subscription;
    randomPlayerNameIndex: number;
    isFirstTurn: boolean = true;
    isEnded: boolean;

    mainPlayerName: string;
    enemyPlayerName: string;

    constructor(private board: BoardService, private reserve: ReserveService, private players: PlayerService, private gridService: GridService) {}

    emptyReserve() {
        return this.reserve.tileCount === 0;
    }

    initialize(gameConfig: GameConfig) {
        this.mainPlayerName = gameConfig.playerName1;
        this.enemyPlayerName = gameConfig.playerName2;
        this.turnDuration = gameConfig.duration;
        this.currentTurnDurationLeft = gameConfig.duration;
        this.isEnded = false;

        this.initializePlayers([this.mainPlayerName, this.enemyPlayerName]);
        this.players.mainPlayer = this.players.getPlayerByName(this.mainPlayerName);

        this.startTimer();
    }

    startTimer() {
        const source = timer(0, SECOND_MD);
        this.subscription = source.subscribe((seconds) => {
            this.currentTurnDurationLeft = this.turnDuration - (seconds % this.turnDuration) - 1;
            if (this.currentTurnDurationLeft === 0) {
                this.currentTurnDurationLeft = this.turnDuration;
                this.switchPlayers();
                // TODO send player switch event
            }
        });
    }

    initializePlayers(playerNames: string[]) {
        this.players.createPlayer(playerNames[0], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        this.players.createPlayer(playerNames[1], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        if (Math.random() > FIRST_PLAYER_COIN_FLIP) this.switchPlayers();
    }

    switchPlayers() {
        this.players.switchPlayers();
        if (this.subscription === undefined) {
            return;
        }
        this.subscription.unsubscribe();
        this.currentTurnDurationLeft = this.turnDuration;
        this.startTimer();
        // Send player switch event
    }

    giveTiles(player: Player, amount: number) {
        const tiles: Tile[] = this.reserve.getLetters(amount);
        player.easel.addTiles(tiles);
    }

    skipTurn() {
        if (this.players.skipCounter >= MAX_SKIP_COUNT - 1) {
            this.endGame();
        }
        this.players.incrementSkipCounter();
        this.switchPlayers();
    }

    // TODO skipCounter to reset when place or exchange command excuted
    resetSkipCounter() {
        this.players.skipCounter = 0;
    }

    // TODO implement stopTimer() to end the game after 6 skipTurn
    endGame() {
        this.stopTimer();
        this.isEnded = true;
    }

    stopTimer() {
        this.subscription.unsubscribe();
    }

    reset() {
        this.stopTimer();
        this.players.clear();
    }

    exchangeTiles(tiles: string, player: Player): string {
        if (this.players.current !== player) {
            return "Ce n'est pas votre tour";
        } else if (!this.reserve.isExchangePossible(tiles.length)) {
            return "Il n'y a pas assez de tuiles dans la réserve";
        } else if (!player.easel.containsTiles(tiles)) {
            return 'Votre chevalet ne contient pas les lettres nécessaires';
        } else {
            const easelTiles: Tile[] = player.easel.getTiles(tiles);
            const reserveTiles: Tile[] = this.reserve.getLetters(tiles.length);
            player.easel.addTiles(reserveTiles);
            this.reserve.returnLetters(easelTiles);
            return `${player.name} a échangé les lettres ${tiles}`;
        }
    }

    placeTiles(word: string, coordStr: string, vertical: boolean, player: Player): string {
        const coord: Vec2 = this.getCoordinateFromString(coordStr);
        if (this.players.current !== player) return "Ce n'est pas votre tour";

        //  check if word can fit on board
        if (vertical) {
            if (coord.y + word.length > GRID_SIZE) return 'Commande impossible a realise';
        } else {
            if (coord.x + word.length > GRID_SIZE) return 'Commande impossible a realise';
        }

        const coords: Vec2[] = new Array();
        let neededLetters = '';
        for (let i = 0; i < word.length; i++) {
            let nextCoord: Vec2;
            if (!vertical) nextCoord = { x: coord.x + i, y: coord.y };
            else nextCoord = { x: coord.x, y: coord.y + i };

            const tile: Tile | undefined = this.board.getTile(nextCoord);
            if (tile) {
                if (tile.letter !== word.charAt(i)) return 'Commande impossible a realise';
            } else {
                neededLetters += word.charAt(i);
                coords.push(nextCoord);
            }
        }

        if (neededLetters.length === 0) return 'Vous ne pouvez pas placer le mot';
        else if (!player.easel.containsTiles(neededLetters)) return 'Votre chevalet ne contient pas les lettres nécessaires';

        //  valider avant de placer
        const neededTiles = player.easel.getTiles(neededLetters);
        for (let i = 0; i < neededLetters.length; i++) {
            this.board.placeTile(coords[i], neededTiles[i]);
        }
        this.gridService.drawBoard();
        return `${player.name} a placé le mot "${word}" ${vertical ? 'verticale' : 'horizentale'}ment à la case ${coordStr}`;
    }

    getCoordinateFromString(coordStr: string): Vec2 {
        const CHAR_OFFSET = 'a'.charCodeAt(0);
        const coordX = coordStr[0].toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const coordY = parseInt(coordStr.substr(1, coordStr.length), 10) - 1;
        return { x: coordX, y: coordY } as Vec2;
    }
}
