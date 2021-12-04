import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Dictionary, GameConfig, GameMode } from '@app/classes/game-config';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { Trie } from '@app/classes/trie';
import { PlayAction, VirtualPlayer } from '@app/classes/virtual-player';
import { COMMAND_RESULT, MAX_SKIP_COUNT, SECOND_MD, STARTING_LETTER_AMOUNT, SYSTEM_NAME, VIRTUAL_PLAYER_MAX_TURN_DURATION } from '@app/constants';
import { BoardService } from '@app/services/board.service';
import { ExchangeTilesService } from '@app/services/exchange-tiles.service';
import { MoveGeneratorService } from '@app/services/move-generator.service';
import { PlayerService } from '@app/services/player.service';
import { ReserveService } from '@app/services/reserve.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { PlaceResult } from '@common/command-result';
import { DictionaryInfo } from '@common/dictionaryTemplate';
import { Move } from '@common/move';
import { Vec2 } from '@common/vec2';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CommunicationService } from './communication.service';
import { GridService } from './grid.service';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';
import { ObjectiveService } from './objective.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    commandMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject({ user: '', body: '' });
    currentTurnDurationLeft: number;
    subscription: Subscription;
    tilePlaceBackSubscription: Subscription;
    randomPlayerNameIndex: number;
    isFirstTurn: boolean = true;
    isEnded: boolean;
    endGameMessage: string = '';
    debug: boolean = false;
    gameConfig: GameConfig;
    firstMove: boolean = true;

    placedWords: Trie;

    constructor(
        public players: PlayerService,
        private reserve: ReserveService,
        private board: BoardService,
        private moveGeneratorService: MoveGeneratorService,
        private exchangeTileService: ExchangeTilesService,
        private virtualPlayerService: VirtualPlayerService,
        private objectiveService: ObjectiveService,
        private http: HttpClient,
        private gridService: GridService,
        private communication: CommunicationService,
    ) {}

    initialize(gameConfig: GameConfig) {
        this.gameConfig = gameConfig;
        this.currentTurnDurationLeft = gameConfig.duration;
        this.isEnded = false;
        this.board.initialize(gameConfig.bonusEnabled);
        let trie = new Trie();
        if ((gameConfig.dictionary as DictionaryInfo).title)
            this.communication.getDictionaryFile(gameConfig.dictionary as DictionaryInfo).subscribe((str) => {
                trie = this.readStringDictionary(str);
            });
        else trie = this.readDictionary('assets/dictionnary.json');
        this.moveGeneratorService.dictionary = trie;
        if (this.gameConfig.gameMode === GameMode.LOG2990) {
            this.placedWords = new Trie();
            this.objectiveService.initialize();
        }
        this.initializePlayers([this.gameConfig.playerName1, this.gameConfig.playerName2]);
        this.players.mainPlayer = this.players.getPlayerByName(this.gameConfig.playerName1);
        this.startTimer();
    }

    initializeFromMultiplayer(gameManager: MultiplayerGameManagerService, vPlayer: Player, mainPlayer: Player) {
        this.gameConfig = {
            playerName1: mainPlayer.name,
            playerName2: vPlayer.name,
            duration: gameManager.lobbyConfig.turnDuration,
            bonusEnabled: gameManager.lobbyConfig.bonusEnabled,
            gameMode: gameManager.lobbyConfig.gameMode,
            dictionary: gameManager.lobbyConfig.dictionary as Dictionary | DictionaryInfo,
            isMultiPlayer: false,
        };
        this.currentTurnDurationLeft = gameManager.lobbyConfig.turnDuration;
        this.board.data = gameManager.board.data;
        this.board.pointGrid = gameManager.board.pointGrid;
        this.reserve.data = gameManager.reserve.data;
        this.reserve.size = gameManager.reserve.size;
        this.players.players = [];
        this.players.players.push({ name: mainPlayer.name, easel: new Easel(mainPlayer.easel.letters), score: mainPlayer.score });
        this.players.mainPlayer = this.players.players[0];
        console.log('MainPlayer: ', this.players.mainPlayer);
        this.virtualPlayerService.setupVirtualPlayer(vPlayer.name, vPlayer.easel, vPlayer.score, false);
        this.players.players.push(this.virtualPlayerService.virtualPlayer);
        this.startTimer();
    }

    startTimer() {
        const source = timer(0, SECOND_MD);
        this.subscription = source.subscribe((seconds) => {
            this.currentTurnDurationLeft = this.gameConfig.duration - (seconds % this.gameConfig.duration) - 1;
            if (
                ((this.players.current as VirtualPlayer).chooseAction !== undefined &&
                    this.currentTurnDurationLeft === this.gameConfig.duration - VIRTUAL_PLAYER_MAX_TURN_DURATION) ||
                this.currentTurnDurationLeft === 0
            ) {
                this.currentTurnDurationLeft = this.gameConfig.duration;
                this.switchPlayers();
            }
        });
    }

    initializePlayers(playerNames: string[]) {
        this.players.players = [];
        this.players.createPlayer(playerNames[0], this.reserve.getRandomLetters(STARTING_LETTER_AMOUNT));
        if (this.gameConfig.isMultiPlayer) this.players.createPlayer(playerNames[1], this.reserve.getRandomLetters(STARTING_LETTER_AMOUNT));
        else {
            this.virtualPlayerService.setupVirtualPlayer(
                playerNames[1],
                new Easel(this.reserve.getRandomLetters(STARTING_LETTER_AMOUNT)),
                0,
                this.gameConfig.expert ? true : false,
            );
            this.players.players.push(this.virtualPlayerService.virtualPlayer);
        }
        if (this.gameConfig.gameMode === GameMode.LOG2990) for (const name of playerNames) this.objectiveService.assignObjective(name);

        this.moveGeneratorService.generateLegalMoves(this.players.current.easel.toString());
    }

    switchPlayers() {
        this.players.switchPlayers();
        this.subscription.unsubscribe();
        this.currentTurnDurationLeft = this.gameConfig.duration;
        this.startTimer();

        if ((this.players.current as VirtualPlayer).chooseAction !== undefined) {
            const vPlayerDelay = new BehaviorSubject<null>(null).pipe(delay(Math.random() * VIRTUAL_PLAYER_MAX_TURN_DURATION));
            vPlayerDelay.subscribe(() => {
                this.playVirtualPlayer();
            });
        }

        this.moveGeneratorService.generateLegalMoves(this.players.current.easel.letters.toString());
    }

    playVirtualPlayer() {
        const vPlayer = this.virtualPlayerService.virtualPlayer;
        const choice = vPlayer.chooseAction(this.reserve, this.moveGeneratorService.legalMoves);
        choice.subscribe((action) => {
            let messageBody = 'MESSAGE_BODY';
            switch (action) {
                case PlayAction.Pass: {
                    this.skipTurn();
                    messageBody = `${vPlayer.name} a passé son tour`;
                    break;
                }
                case PlayAction.Exchange: {
                    const letters: string[] = vPlayer.exchange(this.reserve);
                    this.exchangeLetters(vPlayer, letters);
                    messageBody = `${vPlayer.name} a echangé les lettres ${letters.join('')}`;
                    break;
                }
                case PlayAction.Place: {
                    const move: Move = vPlayer.place(this.moveGeneratorService.legalMoves);
                    this.placeLetters(vPlayer, move.word, move.coord, move.across);
                    messageBody = `${vPlayer.name} a placé le mot ${move.word} ${!move.across ? 'horizental' : 'vertical'}ement a la coordonnee x:${
                        move.coord.y
                    } y:${move.coord.x}`;
                    break;
                }
            }
            this.commandMessage.next({
                user: COMMAND_RESULT,
                body: messageBody,
            });
            this.switchPlayers();
        });
    }

    exchangeLetters(player: Player, letters: string[]): ChatMessage {
        const message = this.exchangeTileService.exchangeLetters(letters, player);
        if (message.body === '') {
            this.players.skipCounter = 0;
            // this.switchPlayers();
            return { user: COMMAND_RESULT, body: `${player.name} a échangé les lettres ${letters}` };
        } else return message;
    }

    placeLetters(player: Player, word: string, coord: Vec2, across: boolean): PlaceResult {
        console.log(this.board);
        if (player.name !== this.players.current.name) return PlaceResult.NotCurrentPlayer;
        if (this.firstMove && this.moveGeneratorService.dictionary.contains(word) && this.isCentered(word, coord, across)) {
            this.moveGeneratorService.legalMove(word, coord, across);
            this.firstMove = false;
        }
        const move: Move | undefined = this.moveGeneratorService.legalMoves.find(
            (_move) => _move.word === word && _move.coord.x === coord.x && _move.coord.y === coord.y && _move.across === across,
        );
        if (!move) return PlaceResult.NotValid;

        const usedLetters: string[] = [];
        const nextCoord = { x: coord.x, y: coord.y };
        for (const k of word) {
            if (!this.board.getLetter(nextCoord)) {
                this.board.setLetter(nextCoord, k);
                usedLetters.push(k);
                const letter: string[] = [k];
                player.easel.getLetters(letter);
                const reserveLetters: string[] = this.reserve.getRandomLetters(1);
                player.easel.addLetters(reserveLetters);
            }

            if (across) nextCoord.y++;
            else nextCoord.x++;
        }
        player.score += move.points;

        if (this.gameConfig.gameMode === GameMode.LOG2990) {
            this.placedWords.insert(move.word);
            this.objectiveService.check(player, move, usedLetters, this.placedWords, this.moveGeneratorService.pointMap);
        }
        this.players.skipCounter = 0;

        this.gridService.drawBoard();
        return PlaceResult.Success;
    }

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
            chevalet de ${this.players.getPlayerByName(this.gameConfig.playerName1).name}: ${
                this.players.getPlayerByName(this.gameConfig.playerName1).easel
            }.<br>
            chevalet de ${this.players.getPlayerByName(this.gameConfig.playerName2).name}: ${
                this.players.getPlayerByName(this.gameConfig.playerName2).easel
            }.`,
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

    readDictionary(dictionary: string): Trie {
        const trie = new Trie();
        this.http.get(dictionary).subscribe((data) => {
            const words: string[] = JSON.parse(JSON.stringify(data)).words;
            for (const word of words) trie.insert(word);
        });
        return trie;
    }

    readStringDictionary(dictionary: string): Trie {
        const trie = new Trie();
        const words: string[] = JSON.parse(dictionary).words;
        for (const word of words) trie.insert(word);
        return trie;
    }

    isCentered(word: string, coord: Vec2, across: boolean): boolean {
        const center = Math.floor(this.board.data.length / 2);
        return across ? coord.y <= center && coord.y + word.length - 1 >= center : coord.x <= center && coord.x + word.length - 1 >= center;
    }
}
