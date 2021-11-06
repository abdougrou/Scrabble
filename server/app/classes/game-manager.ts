import { CLASSIC_RESERVE } from '@app/constants';
import { ExchangeResult, PassResult, PlaceResult, ReserveResult } from '@common/command-result';
import { Board } from './board';
import { transpose } from './board-utils';
import { Easel } from './easel';
import { Move, MoveGenerator } from './move-generator';
import { Player } from './player';
import { Reserve } from './reserve';
import { Trie } from './trie';
import { Vec2 } from './vec2';

export class GameManager {
    players: Player[];
    reserve: Reserve;
    board: Board;
    moveGenerator: MoveGenerator;

    constructor() {
        this.players = [];
        this.reserve = new Reserve(CLASSIC_RESERVE);
        this.board = new Board();
        this.moveGenerator = new MoveGenerator(new Trie()); // TODO Fill trie with words
        this.board = new Board();
        this.board.initialize(false);
    }

    /**
     * Adds a player to the game
     *
     * @param name player name, must be different than current player's name
     * @returns true if the player is added successfully
     */
    addPlayer(name: string): boolean {
        if (this.players.length > 1) return false;
        else if (this.players[0]?.name === name) return false;
        this.players.push({ name, easel: new Easel(), score: 0 });
        console.log(this.players[0]?.easel.letters);
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
        // reset timer
        return PassResult.Success;
    }

    /**
     * Places a word on the board if it is possible
     *
     * @param player player to place letters
     * @param word word to place on the board
     * @param coord word's starting coordinate
     * @param across whether the word is across or down
     * @returns PlaceResult
     */
    placeLetters(player: Player, word: string, coord: Vec2, across: boolean): PlaceResult {
        if (player.name !== this.players[0].name) return PlaceResult.NotCurrentPlayer;

        const move: Move | undefined = this.moveGenerator.legalMoves.find(
            (_move) => _move.word === word && _move.coord === coord && _move.across === across,
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
                player.easel.getLetters([k]);
            }
            points += this.moveGenerator.calculateCrossSum(this.board.data, coord, move.across);

            if (across) nextCoord.y++;
            else nextCoord.x++;
        }
        points += this.moveGenerator.calculateWordPoints(move, row, pointRow);

        // place the word on the board, recalculate anchors and cross checks
        player.score += points;
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
    printReserve(player: Player): ReserveResult | string {
        if (player.name !== this.players[0].name) return ReserveResult.NotCurrentPlayer;
        else if (!player.debug) return ReserveResult.NotInDebugMode;
        return this.reserve.toString();
    }
}
