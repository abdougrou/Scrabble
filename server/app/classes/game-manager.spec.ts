import { ExchangeResult, PassResult, ReserveResult as PrintReserveResult } from '@common/command-result';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Easel } from './easel';
import { GameManager } from './game-manager';
import { Player } from './player';
import { Reserve } from './reserve';

describe('GameManager', () => {
    let gameManager: GameManager;

    beforeEach(() => {
        gameManager = new GameManager();
    });

    it('addPlayer adds players', () => {
        expect(gameManager.addPlayer('player1')).to.equal(true);
        expect(gameManager.addPlayer('player1')).to.equal(false);
        expect(gameManager.addPlayer('player2')).to.equal(true);
        expect(gameManager.addPlayer('player3')).to.equal(false);
    });

    it('getPlayer returns correct values', () => {
        const player1: Player = { name: 'player1', easel: new Easel(['a', 'b', 'c']), score: 0 };
        const player2: Player = { name: 'player2', easel: new Easel(['a', 'b', 'c']), score: 0 };
        gameManager.players = [player1, player2];

        expect(gameManager.getPlayer(player1.name)).to.equal(player1);
        expect(gameManager.getPlayer('player3')).to.equal(undefined);
    });

    it('swapPlayers swaps players', () => {
        gameManager.addPlayer('player1');
        gameManager.addPlayer('player2');
        gameManager.swapPlayers();
        const expected = 'player2,player1';
        expect(gameManager.players.map((player) => player.name).join()).to.equal(expected);
    });

    it('passTurn returns correct enum value', () => {
        const player1: Player = { name: 'player1', easel: new Easel(['a', 'b', 'c']), score: 0 };
        const player2: Player = { name: 'player2', easel: new Easel(['a', 'b', 'c']), score: 0 };
        gameManager.players = [player1, player2];

        expect(gameManager.passTurn(player2)).to.equal(PassResult.NotCurrentPlayer);
        expect(gameManager.passTurn(player1)).to.equal(PassResult.Success);
    });

    it('exchangeLetters returns correct enum value', () => {
        const player1: Player = { name: 'player1', easel: new Easel(['a', 'b', 'c']), score: 0 };
        const player2: Player = { name: 'player2', easel: new Easel(['a', 'b', 'c']), score: 0 };
        gameManager.players = [player1, player2];

        expect(gameManager.exchangeLetters(player2, 'ab')).to.equal(ExchangeResult.NotCurrentPlayer);
        expect(gameManager.exchangeLetters(player1, 'abcd')).to.equal(ExchangeResult.NotInEasel);
        expect(gameManager.exchangeLetters(player1, 'abd')).to.equal(ExchangeResult.NotInEasel);
        expect(gameManager.exchangeLetters(player1, 'abc')).to.equal(ExchangeResult.Success);
        const count = 100;
        gameManager.reserve.getRandomLetters(count);
        expect(gameManager.exchangeLetters(player1, player1.easel.toString().split(',').join('').toLowerCase())).to.equal(
            ExchangeResult.NotEnoughInReserve,
        );
    });

    it('printReserve returns correct value', () => {
        const player1: Player = { name: 'player1', easel: new Easel(['a', 'b', 'c']), score: 0, debug: false };
        const player2: Player = { name: 'player2', easel: new Easel(['a', 'b', 'c']), score: 0, debug: true };
        gameManager.players = [player1, player2];

        const reserveStr = 'a,5\nb,3';
        gameManager.reserve = new Reserve(reserveStr);
        expect(gameManager.printReserve(player2)).to.equal(PrintReserveResult.NotCurrentPlayer);
        expect(gameManager.printReserve(player1)).to.equal(PrintReserveResult.NotInDebugMode);
        gameManager.swapPlayers();
        const expected = 'A: 5\nB: 3';
        expect(gameManager.printReserve(player2)).to.equal(expected);
    });
});
