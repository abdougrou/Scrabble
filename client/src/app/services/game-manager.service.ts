/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { transpose } from '@app/classes/board-utils';
import { GameConfig } from '@app/classes/game-config';
import { ChatMessage } from '@app/classes/message';
import { Move } from '@app/classes/move';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { PlayAction, VirtualPlayer } from '@app/classes/virtual-player';
import { COMMAND_RESULT, MAX_SKIP_COUNT, SECOND_MD, STARTING_LETTER_AMOUNT, SYSTEM_NAME } from '@app/constants';
import { BoardService } from '@app/services/board.service';
import { ExchangeTilesService } from '@app/services/exchange-tiles.service';
import { MoveGeneratorService } from '@app/services/move-generator.service';
import { PlayerService } from '@app/services/player.service';
import { ReserveService } from '@app/services/reserve.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { PlaceResult } from '@common/command-result';
import { BehaviorSubject, Subscription, timer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    commandMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject({ user: '', body: '' });
    endTurn: BehaviorSubject<string> = new BehaviorSubject('');
    turnDuration: number;
    currentTurnDurationLeft: number;
    subscription: Subscription;
    tilePlaceBackSubscription: Subscription;
    randomPlayerNameIndex: number;
    isFirstTurn: boolean = true;
    mainPlayerName: string;
    enemyPlayerName: string;
    isEnded: boolean;
    endGameMessage: string = '';
    debug: boolean = false;
    isMultiPlayer: boolean;

    constructor(
        public players: PlayerService,
        private reserve: ReserveService,
        private board: BoardService,
        private moveGeneratorService: MoveGeneratorService,
        private exchangeTileService: ExchangeTilesService,
        private virtualPlayerService: VirtualPlayerService,
    ) {}

    initialize(gameConfig: GameConfig) {
        this.mainPlayerName = gameConfig.playerName1;
        this.enemyPlayerName = gameConfig.playerName2;
        this.isMultiPlayer = gameConfig.isMultiPlayer;
        this.turnDuration = gameConfig.duration;
        this.currentTurnDurationLeft = gameConfig.duration;
        this.isEnded = false;
        this.board.initialize(gameConfig.bonusEnabled);
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

    // startTilePLaceBackCountdown(player: Player, retrievedTiles: Tile[], tilesToPlace: TileCoords[]) {
    //     const source = timer(0, SECOND_MD);
    //     this.tilePlaceBackSubscription = source.subscribe((seconds) => {
    //         const counter = 3 - (seconds % 3) - 1;
    //         if (counter === 0) {
    //             player.easel.addTiles(retrievedTiles);
    //             for (const aTile of tilesToPlace) {
    //                 this.board.board.delete(this.board.coordToKey(aTile.coords));
    //             }
    //             this.gridService.drawBoard();
    //             this.tilePlaceBackSubscription.unsubscribe();
    //         }
    //     });
    // }

    initializePlayers(playerNames: string[]) {
        this.players.createPlayer(playerNames[0], this.reserve.getRandomLetters(STARTING_LETTER_AMOUNT));
        if (this.isMultiPlayer) this.players.createPlayer(playerNames[1], this.reserve.getRandomLetters(STARTING_LETTER_AMOUNT));
        else this.players.createVirtualPlayer(playerNames[1], this.reserve.getRandomLetters(STARTING_LETTER_AMOUNT));
        // if (Math.random() > FIRST_PLAYER_COIN_FLIP) this.switchPlayers();

        this.moveGeneratorService.generateLegalMoves(this.players.current.easel.letters.join(''));
    }

    switchPlayers() {
        this.players.switchPlayers();
        this.subscription.unsubscribe();
        this.currentTurnDurationLeft = this.turnDuration;
        this.startTimer();
        // Send player switch event
        this.endTurn.next(this.players.current.name);
        if ((this.players.current as VirtualPlayer).chooseAction !== undefined) this.playVirtualPlayer();

        this.moveGeneratorService.generateLegalMoves(this.players.current.easel.letters.join(''));
    }

    playVirtualPlayer() {
        const vPlayer = this.virtualPlayerService.virtualPlayer;
        const choice = vPlayer.chooseAction();
        choice.subscribe((action) => {
            switch (action) {
                case PlayAction.Pass:
                    break;
                case PlayAction.Exchange:
                    this.exchangeLetters(vPlayer, vPlayer.exchange());
                    break;
                case PlayAction.Place: {
                    const move: Move = vPlayer.place();
                    this.placeLetters(vPlayer, move.word, move.coord, move.across);
                    break;
                }
            }
        });
    }

    exchangeLetters(player: Player, letters: string[]): ChatMessage {
        const message = this.exchangeTileService.exchangeLetters(letters, player);
        if (message.body === '') {
            this.players.skipCounter = 0;
            this.switchPlayers();
            return { user: COMMAND_RESULT, body: `${player.name} a échangé les lettres ${letters}` };
        } else return message;
    }

    placeLetters(player: Player, word: string, coord: Vec2, across: boolean): PlaceResult {
        if (player.name !== this.players.current.name) return PlaceResult.NotCurrentPlayer;
        this.moveGeneratorService.legalMove(word, coord, across);
        const move: Move | undefined = this.moveGeneratorService.legalMoves.find(
            (_move) => _move.word === word && _move.coord.x === coord.x && _move.coord.y === coord.y && _move.across === across,
        );
        if (!move) return PlaceResult.NotValid;

        const nextCoord = coord;
        let points = 0;
        const row: (string | null)[] = (move.across ? this.board.data : transpose(this.board.data))[move.across ? move.coord.x : move.coord.y] as (
            | string
            | null
        )[];
        const pointRow: number[] = (move.across ? this.board.pointGrid : transpose(this.board.pointGrid))[
            move.across ? move.coord.x : move.coord.y
        ] as number[];
        for (const k of word) {
            if (!this.board.getLetter(nextCoord)) {
                this.board.setLetter(nextCoord, k);
                const words: string[] = [k];
                player.easel.getLetters(words);
                const reserveLetters: string[] = this.reserve.getRandomLetters(1);
                player.easel.addLetters(reserveLetters);
            }
            points += this.moveGeneratorService.calculateCrossSum(coord, across);

            if (across) nextCoord.y++;
            else nextCoord.x++;
        }
        points += this.moveGeneratorService.calculateWordPoints(move, row, pointRow);

        // place the word on the board, recalculate anchors and cross checks
        player.score += points;
        return PlaceResult.Success;
    }

    // playVirtualPlayer() {
    //     const vPlayer: VirtualPlayer = this.players.current as VirtualPlayer;
    //     vPlayer.play().subscribe((action) => {
    //         switch (action) {
    //             case PlayAction.ExchangeTiles: {
    //                 const tilesToExchange = vPlayer.exchange();
    //                 if (this.reserve.isExchangePossible(tilesToExchange.length)) {
    //                     const msg: ChatMessage = this.exchangeTiles(tilesToExchange, vPlayer);
    //                     this.commandMessage.next(msg);
    //                 } else {
    //                     this.buttonSkipTurn();
    //                 }
    //                 break;
    //             }
    //             case PlayAction.PlaceTiles: {
    //                 const placeTilesInfo: PlaceTilesInfo = vPlayer.place(
    //                     this.wordValidation,
    //                     this.calculatePoints,
    //                     this.board,
    //                     this.commandMessage,
    //                     this.debug,
    //                 );
    //                 // console.log(
    //                 //     `Bot places the word "${placeTilesInfo.word}" ${placeTilesInfo.vertical ? 'vertical' : 'horizontal'}ly at ${
    //                 //         placeTilesInfo.coordStr
    //                 //     }`,
    //                 // );
    //                 if (placeTilesInfo.word.length > 0) {
    //                     // console.log(placeTilesInfo);
    //                     // console.log(this.placeTiles(placeTilesInfo.word, placeTilesInfo.coordStr, placeTilesInfo.vertical, vPlayer));
    //                     const msg: ChatMessage = {
    //                         user: this.enemyPlayerName,
    //                         body: this.placeTiles(placeTilesInfo.word, placeTilesInfo.coordStr, placeTilesInfo.vertical, vPlayer),
    //                     };
    //                     this.commandMessage.next(msg);
    //                 } else {
    //                     this.buttonSkipTurn();
    //                 }
    //                 break;
    //             }
    //             default:
    //                 // console.log('Bot skipped his turn');
    //                 this.buttonSkipTurn();
    //                 break;
    //         }
    //     });
    // }

    // giveTiles(player: Player, amount: number) {
    //     const tiles: Tile[] = this.reserve.getLetters(amount);
    //     player.easel.addTiles(tiles);
    // }

    buttonSkipTurn(): void {
        const msg: ChatMessage = { user: COMMAND_RESULT, body: `${this.players.current.name} a passé son tour` };
        this.commandMessage.next(msg);
        this.skipTurn();
    }

    skipTurn() {
        this.players.skipCounter++;
        if (this.players.skipCounter >= MAX_SKIP_COUNT) {
            this.endGame();
        } else {
            this.switchPlayers();
        }
    }

    // // TODO implement stopTimer() to end the game after 6 skipTurn
    endGame() {
        const msg: ChatMessage = {
            user: SYSTEM_NAME,
            body: `La partie est terminée! <br>
            chevalet de ${this.players.getPlayerByName(this.mainPlayerName).name}: ${this.players.getPlayerByName(this.mainPlayerName).easel}.<br>
            chevalet de ${this.players.getPlayerByName(this.enemyPlayerName).name}: ${this.players.getPlayerByName(this.enemyPlayerName).easel}.`,
        };
        this.commandMessage.next(msg);
        this.stopTimer();
        this.isEnded = true;
    }

    stopTimer() {
        this.subscription.unsubscribe();
    }

    reset() {
        this.stopTimer();
        this.board.initialize(false); // TODO repalce false by real value
        this.reserve = new ReserveService();
        this.players.clear();
    }

    activateDebug(): string {
        if (this.debug) {
            this.debug = false;
            return 'affichages de débogage désactivés';
        } else {
            this.debug = true;
            return 'affichages de débogage activés';
        }
    }

    // eslint-disable-next-line no-unused-vars
    placeTiles(word: string, coordStr: string, vertical: boolean, player: Player): string {
        //     //  Check if it's the player's turn to play
        //     if (this.players.current !== player) return "Ce n'est pas votre tour";
        //     //  Get the tiles and coordinates associated to the word
        //     const tileCoords: TileCoords[] = this.getTileCoords(word, coordStr, vertical);
        //     //  Compare the letter positions to the tiles on the board
        //     if (this.wordCollides(tileCoords)) return 'Commande impossible a realise';
        //     //  Check that the command will lead to tiles being placed
        //     if (tileCoords.length === 0) return 'Le mot que vous tentez de placer se trouve deja sur le tableau';
        //     //  Manage blank letters
        //     const tilesToRetrieve: TileCoords[] = [];
        //     const tilesToPlace: TileCoords[] = [];
        //     for (const tileCoord of tileCoords) {
        //         if (tileCoord.tile.letter === tileCoord.tile.letter.toUpperCase()) {
        //             tilesToRetrieve.push({ tile: { letter: '*', points: tileCoord.tile.points }, coords: tileCoord.coords });
        //             tilesToPlace.push({ tile: { letter: tileCoord.tile.letter.toLowerCase(), points: 0 }, coords: tileCoord.coords });
        //         } else {
        //             tilesToRetrieve.push(tileCoord);
        //             tilesToPlace.push(tileCoord);
        //         }
        //     }
        //     //  Check that the easel contains all the needed letters
        //     if (!player.easel.containsTiles(this.getStringToRetrieve(tilesToRetrieve))) return 'Votre c
        //     hevalet ne contient pas les lettres nécessaires';
        //     //  Retrieve the tiles from the player's easel
        //     const retrievedTiles: Tile[] = player.easel.getTiles(this.getStringToRetrieve(tilesToRetrieve));
        //     //  Check that the position of the word is valid
        //     if (this.validWordPosition(word, tilesToPlace, vertical)) {
        //         //  check that the word itself is valid
        //         //  We place the tiles on the board and give the player new tiles if the word and position are valid
        //         const scoreNewTiles = this.calculatePoints.calculatePoints(tilesToPlace);
        //         for (const aTile of tilesToPlace) {
        //             this.board.placeTile(aTile.coords, aTile.tile);
        //         }
        //         this.gridService.drawBoard();
        //         if (this.wordValidation.validateWords(tilesToPlace)) {
        //             player.score += scoreNewTiles;
        //             const numTiles = this.reserve.tileCount < tilesToPlace.length ? this.reserve.tileCount : tilesToPlace.length;
        //             player.easel.addTiles(this.reserve.getLetters(numTiles));
        //         } else {
        //             this.startTilePLaceBackCountdown(player, retrievedTiles, tilesToPlace);
        //             this.gridService.drawBoard();
        //             return 'le mot nest pas dans le dictionnaire';
        //         }
        //     } else {
        //         //  We give the player his tiles back if the word is invalid
        //         player.easel.addTiles(retrievedTiles);
        //         return 'placement de mot invalide';
        //     }
        //     this.gridService.drawBoard();
        //     this.switchPlayers();
        //     this.players.skipCounter = 0;
        //     return `${player.name} a placé le mot "${word}" ${vertical ? 'verticale' : 'horizontale'}ment à la case ${coordStr}`;
        return '';
    }

    // wordCollides(tileCoords: TileCoords[]): boolean {
    //     for (let i = tileCoords.length - 1; i >= 0; i--) {
    //         if (this.board.getTile(tileCoords[i].coords)) {
    //             if ((this.board.getTile(tileCoords[i].coords) as Tile).letter === tileCoords[i].tile.letter) {
    //                 tileCoords.splice(i, 1);
    //             } else {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    // getTileCoords(word: string, coordStr: string, vertical: boolean): TileCoords[] {
    //     const coords = this.getCoordinateFromString(coordStr);
    //     const tileCoords: TileCoords[] = [];
    //     for (let i = 0; i < word.length; i++) {
    //         const coord: Vec2 = vertical ? { x: coords.x, y: coords.y + i } : { x: coords.x + i, y: coords.y };
    //         tileCoords.push({ tile: { letter: word.charAt(i), points: LETTER_POINTS.get(word.charAt(i)) as number }, coords: coord });
    //     }
    //     return tileCoords;
    // }
    // private getStringToRetrieve(tileCoords: TileCoords[]): string {
    //     let stringToRetrieve = '';
    //     for (const aLetter of tileCoords) {
    //         stringToRetrieve += aLetter.tile.letter;
    //     }
    //     return stringToRetrieve;
    // }
    // private validWordPosition(word: string, tilesToPlace: TileCoords[], vertical: boolean): boolean {
    //     const BOARD_CENTER: Vec2 = { x: 7, y: 7 };
    //     //  Check if word is placed outside of the board
    //     for (const aTile of tilesToPlace) {
    //         if (aTile.coords.x >= GRID_SIZE || aTile.coords.y >= GRID_SIZE) return false;
    //     }
    //     //  if first turn, the word must touch the center of the board
    //     if (this.board.board.size === 0) {
    //         let isCenter = false;
    //         for (const aTile of tilesToPlace) {
    //             if (aTile.coords.x === BOARD_CENTER.x && aTile.coords.y === BOARD_CENTER.y) {
    //                 isCenter = true;
    //             }
    //         }
    //         return isCenter;
    //     }
    //     // If size of tiles to be placed is inferior to size of word we can determine the word touches another one
    //     if (tilesToPlace.length < word.length) {
    //         return true;
    //     } else {
    //         //  Iterate through the tiles to see if any of them is adjacent to a tile on the board
    //         let isTouching = false;
    //         for (const aTile of tilesToPlace) {
    //             const firstCoord = vertical ? { x: aTile.coords.x + 1, y: aTile.coords.y } : { x: aTile.coords.x, y: aTile.coords.y + 1 };
    //             const secondCoord = vertical ? { x: aTile.coords.x - 1, y: aTile.coords.y } : { x: aTile.coords.x, y: aTile.coords.y - 1 };
    //             if (this.board.getTile(firstCoord) !== undefined || this.board.getTile(secondCoord) !== undefined) isTouching = true;
    //         }
    //         return isTouching;
    //     }
    // }
}
