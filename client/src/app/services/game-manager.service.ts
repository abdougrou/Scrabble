import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { PlayAction, Player } from '@app/classes/player';
import { PlaceTilesInfo, Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { GRID_SIZE, RANDOM_PLAYER_NAMES, SECOND_MD, STARTING_TILE_AMOUNT } from '@app/constants';
import { timer } from 'rxjs';
import { BoardService } from './board.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { WordValidationService } from './word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    turnDuration: number;
    currentTurnDurationLeft: number;
    randomPlayerNameIndex: number;
    isMultiPlayer: boolean;
    isFirstTurn: boolean = true;

    mainPlayerName: string;
    enemyPlayerName: string;

    constructor(
        private board: BoardService,
        private reserve: ReserveService,
        private players: PlayerService,
        private validation: WordValidationService,
    ) {}

    initialize(gameConfig: GameConfig) {
        this.mainPlayerName = gameConfig.playerName1;
        this.enemyPlayerName = gameConfig.playerName2;
        this.isMultiPlayer = gameConfig.isMultiPlayer;
        this.turnDuration = gameConfig.duration;
        this.currentTurnDurationLeft = gameConfig.duration;
        this.randomPlayerNameIndex = Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length);

        this.initializePlayers([gameConfig.playerName1, RANDOM_PLAYER_NAMES[this.randomPlayerNameIndex]]);

        this.startTimer();
    }

    startTimer() {
        const source = timer(0, SECOND_MD);
        source.subscribe((seconds) => {
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
        if (this.isMultiPlayer) this.players.createPlayer(playerNames[1], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        else this.players.createVirtualPlayer(playerNames[1], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        // if (Math.random() > FIRST_PLAYER_COIN_FLIP) this.switchPlayers();
        this.switchPlayers();
    }

    switchPlayers() {
        this.players.switchPlayers();
        this.currentTurnDurationLeft = this.turnDuration;

        if (this.players.current instanceof VirtualPlayer) this.playVirtualPlayer();
    }

    playVirtualPlayer() {
        console.log("Bot's turn");
        const vPlayer: VirtualPlayer = this.players.current as VirtualPlayer;
        vPlayer.play().subscribe((action) => {
            switch (action) {
                case PlayAction.ExchangeTiles: {
                    const tilesToExchange = vPlayer.exchange();
                    console.log(`Bot exchanges the letters ${tilesToExchange}`);
                    if (this.reserve.isExchangePossible(tilesToExchange.length)) this.exchangeTiles(tilesToExchange, vPlayer);
                    break;
                }
                case PlayAction.PlaceTiles: {
                    const placeTilesInfo: PlaceTilesInfo = vPlayer.place(this.validation);
                    console.log(
                        `Bot places the word "${placeTilesInfo.word}" ${placeTilesInfo.vertical ? 'vertical' : 'horizontal'}ly at ${
                            placeTilesInfo.coordStr
                        }`,
                    );
                    this.placeTiles(placeTilesInfo.word, placeTilesInfo.coordStr, placeTilesInfo.vertical, vPlayer);
                    break;
                }
                default:
                    console.log('Bot skipped his turn');
                    break;
            }
        });
        this.skipTurn();
    }

    giveTiles(player: Player, amount: number) {
        const tiles: Tile[] = this.reserve.getLetters(amount);
        player.easel.addTiles(tiles);
    }

    skipTurn() {
        this.players.incrementSkipCounter();
        this.switchPlayers();
    }

    // TODO skipCounter to reset when place or exchange command excuted

    // TODO implement stopTimer() to end the game after 6 skipTurn

    reset() {
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
        return `${player.name} a placé le mot "${word}" ${vertical ? 'verticale' : 'horizentale'}ment à la case ${coordStr}`;
    }

    getCoordinateFromString(coordStr: string): Vec2 {
        const CHAR_OFFSET = 'a'.charCodeAt(0);
        const coordX = coordStr[0].toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const coordY = parseInt(coordStr.substr(1, coordStr.length), 10) - 1;
        return { x: coordX, y: coordY } as Vec2;
    }
}
