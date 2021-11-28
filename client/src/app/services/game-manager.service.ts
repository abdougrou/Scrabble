import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { PlayAction, VirtualPlayer } from '@app/classes/virtual-player';
import { COMMAND_RESULT, MAX_SKIP_COUNT, SECOND_MD, STARTING_LETTER_AMOUNT, SYSTEM_NAME } from '@app/constants';
import { BoardService } from '@app/services/board.service';
import { ExchangeTilesService } from '@app/services/exchange-tiles.service';
import { MoveGeneratorService } from '@app/services/move-generator.service';
import { PlayerService } from '@app/services/player.service';
import { ReserveService } from '@app/services/reserve.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { PlaceResult } from '@common/command-result';
import { Move } from '@common/move';
import { Vec2 } from '@common/vec2';
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
        for (const k of word) {
            if (!this.board.getLetter(nextCoord)) {
                this.board.setLetter(nextCoord, k);
                const words: string[] = [k];
                player.easel.getLetters(words);
                const reserveLetters: string[] = this.reserve.getRandomLetters(1);
                player.easel.addLetters(reserveLetters);
            }

            if (across) nextCoord.y++;
            else nextCoord.x++;
        }

        player.score += move.points;
        return PlaceResult.Success;
    }
    // TODO: COPY MESSAGES THEN DELETE THIS
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
}
