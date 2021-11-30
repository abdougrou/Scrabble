import { CLASSIC_RESERVE } from '@app/constants';
import { DictionaryService } from '@app/services/dictionary.service';
import { ExchangeResult, PassResult, PlaceResult } from '@common/command-result';
import { DictionaryInfo } from '@common/dictionaryTemplate';
import { GameMode, LobbyConfig } from '@common/lobby-config';
import { Move } from '@common/move';
import { Vec2 } from '@common/vec2';
import { readFileSync } from 'fs';
import { Board } from './board';
import { Easel } from './easel';
import { MoveGenerator } from './move-generator';
import { Objective, OBJECTIVES } from './objective';
import { Player } from './player';
import { Reserve } from './reserve';
import { Trie } from './trie';

export class GameManager {
    players: Player[];
    reserve: Reserve;
    board: Board;
    moveGenerator: MoveGenerator;
    firstMove: boolean = true;
    dictionaryService: DictionaryService = new DictionaryService();

    /**
     * Objectives related variables
     */
    objectives: Objective[];
    placedWords: Trie = new Trie();

    constructor(private config: LobbyConfig) {
        this.players = [];
        this.objectives = [];
        this.reserve = new Reserve(CLASSIC_RESERVE);
        let trie = new Trie();
        if (config.dictionary as DictionaryInfo)
            trie = this.readStringDictionary(this.dictionaryService.sendDictionaryFile(config.dictionary as DictionaryInfo));
        else trie = this.readDictionary('@app/../assets/dictionnary.json');
        this.moveGenerator = new MoveGenerator(trie);
        this.board = new Board();
        this.board.initialize(config.bonusEnabled);

        if (config.gameMode === GameMode.LOG2990) {
            const SORT_RANDOM = 0.5;
            const OBJECTIVES_COUNT = 4;
            this.objectives = OBJECTIVES.map((objective) => Object.assign({}, objective));
            this.objectives.sort(() => SORT_RANDOM - Math.random());
            while (this.objectives.length > OBJECTIVES_COUNT) this.objectives.pop();
        }
    }

    /**
     * Adds a player to the game and assigns private objective if LOG2990 mode
     *
     * @param name player name, must be different than current player's name
     * @returns true if the player is added successfully
     */
    addPlayer(name: string): boolean {
        if (this.players.length > 1) return false;
        else if (this.players[0]?.name === name) return false;
        const startingLetterCount = 7;
        const player = { name, easel: new Easel(this.reserve.getRandomLetters(startingLetterCount)), score: 0 };
        this.players.push(player);

        // Assign private objective
        if (this.config.gameMode === GameMode.LOG2990) {
            this.objectives.reverse();
            const objective = this.objectives.pop() as Objective;
            objective.playerName = name;
            objective.private = true;
            this.objectives.push(objective);
        }

        return true;
    }

    /**
     * Removes a player from the game
     *
     * @param name player to remove
     * @returns true if the player was removed, false otherwise
     */
    removePlayer(name: string): boolean {
        const newPlayers = this.players.filter((player) => player.name !== name);
        if (newPlayers.length < this.players.length) {
            this.players = newPlayers;
            return true;
        }
        return false;
    }

    /**
     * Get a player by name
     *
     * @param name player name
     * @returns Player if they're in game, undefined otherwise
     */
    getPlayer(name: string): Player | undefined {
        for (const player of this.players) if (player.name === name) return player;
        return undefined;
    }

    swapPlayers() {
        this.players.reverse();
        this.moveGenerator.calculateAnchorsAndCrossChecks(this.board.data);
        this.moveGenerator.generateLegalMoves(this.board.data, this.players[0].easel.letters.join(''));
    }

    /**
     * Passes a player's turn
     *
     * @param player player to pass their turn
     * @returns PassResult
     */
    passTurn(player: Player): PassResult {
        if (player.name !== this.players[0].name) return PassResult.NotCurrentPlayer;
        this.swapPlayers();
        return PassResult.Success;
    }

    /**
     * Places a word on the board if it is possible
     *
     * Refills the player's easel if letters are placed
     *
     * @param player player to place letters
     * @param word word to place on the board
     * @param coord word's starting coordinate
     * @param across whether the word is across or down
     * @returns PlaceResult
     */
    placeLetters(player: Player, word: string, coord: Vec2, across: boolean): PlaceResult {
        if (player.name !== this.players[0].name) return PlaceResult.NotCurrentPlayer;
        if (this.firstMove && this.moveGenerator.dictionary.contains(word) && this.isCentered(word, coord, across)) {
            this.moveGenerator.legalMove(this.board.data, word, coord, across);
            this.firstMove = false;
        }
        const move: Move | undefined = this.moveGenerator.legalMoves.find(
            (_move) => _move.word === word && _move.coord.x === coord.x && _move.coord.y === coord.y && _move.across === across,
        );
        if (!move) return PlaceResult.NotValid;

        const usedLetters: string[] = [];
        const nextCoord = coord;
        for (const k of word) {
            if (!this.board.getLetter(nextCoord)) {
                this.board.setLetter(nextCoord, k);
                usedLetters.push(k);
                const letter: string[] = [k];
                player.easel.getLetters(letter);
                const reserveLetter: string[] = this.reserve.getRandomLetters(1);
                player.easel.addLetters(reserveLetter);
            }

            if (across) nextCoord.y++;
            else nextCoord.x++;
        }
        player.score += move.points;

        this.placedWords.insert(move.word);
        // Objectives
        for (const objective of this.objectives) {
            if (!objective.achieved && (!objective.private || objective.playerName === player.name)) {
                const objectiveResult = objective.check(move, usedLetters, this.placedWords, this.moveGenerator.pointMap);
                if (objectiveResult) {
                    player.score += objective.reward;
                    objective.achieved = true;
                }
            }
        }

        return PlaceResult.Success;
    }

    /**
     * Exchanges letters of a player's easel with the reserve letters
     *
     * @param player the player to exchange letters
     * @param letters letters to exchange
     * @returns ExchangeResult
     */
    exchangeLetters(player: Player, letters: string): ExchangeResult {
        if (player.name !== this.players[0].name) return ExchangeResult.NotCurrentPlayer;
        else if (!player.easel.contains(letters.split(''))) return ExchangeResult.NotInEasel;
        else if (!this.reserve.isExchangePossible(letters.length)) return ExchangeResult.NotEnoughInReserve;

        const easelLetters: string[] = player.easel.getLetters(letters.split(''));
        const reserveLetters: string[] = this.reserve.getRandomLetters(letters.length);
        player.easel.addLetters(reserveLetters);
        this.reserve.returnLetters(easelLetters);
        return ExchangeResult.Success;
    }

    /**
     * Prints the reserve in string format
     *
     * @param player the player to print the reserve to
     * @returns PrintReserveResult if failed, reserve string if success
     */
    printReserve(): string {
        return this.reserve.toString();
    }

    /**
     * Creates a Trie from the dictionary at the path provided
     *
     * @param dictionary dictionary path
     * @returns Trie representing the dictionary
     */
    readDictionary(dictionary: string): Trie {
        const trie = new Trie();
        const raw = readFileSync(dictionary).toString();
        const words: string[] = JSON.parse(raw).words;
        words.forEach((word) => {
            trie.insert(word);
        });
        return trie;
    }

    /**
     * Read stringified dictionary in a trie.
     *
     * @param dictionary takes a stringed dictionary
     * @returns trie
     */
    readStringDictionary(dictionary: string): Trie {
        const trie = new Trie();
        const words: string[] = JSON.parse(dictionary).words;
        for (const word of words) trie.insert(word);
        return trie;
    }

    /**
     * Checks if a word we try to place is centered
     *
     * @param word to place
     * @param coord word's starting coordinate
     * @param across whether the word is across or down
     * @returns true if the word passes by the center of the board
     */
    isCentered(word: string, coord: Vec2, across: boolean): boolean {
        const center = Math.floor(this.board.data.length / 2);
        return across ? coord.y <= center && coord.y + word.length - 1 >= center : coord.x <= center && coord.x + word.length - 1 >= center;
    }
}
