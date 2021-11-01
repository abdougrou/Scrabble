import { CLASSIC_RESERVE } from '@app/constants';
import { ExchangeResult, PassResult, ReserveResult } from './command-result';
import { Easel } from './easel';
import { Player } from './player';
import { Reserve } from './reserve';

export class GameManager {
    players: Player[];
    reserve: Reserve;

    constructor() {
        this.players = [];
        this.reserve = new Reserve(CLASSIC_RESERVE);
    }

    /**
     * Adds a player to the game, max 2 players
     *
     * @param name player name
     */
    addPlayer(name: string): boolean {
        if (this.players.length > 1) return false;
        for (const player of this.players) if (name === player.name) return false;
        this.players.push({ name, easel: new Easel(), score: 0 });
        return true;
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
