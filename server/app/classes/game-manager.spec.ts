import { ExchangeResult, PassResult, PlaceResult } from '@common/command-result';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Easel } from './easel';
import { GameManager } from './game-manager';
import { Move } from './move-generator';
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

    it('removePlayer removes the player', () => {
        gameManager.addPlayer('player1');
        gameManager.addPlayer('player2');
        expect(gameManager.removePlayer('player1')).to.equal(true);
        expect(gameManager.removePlayer('player3')).to.equal(false);
        expect(gameManager.players.length).to.equal(1);
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
        const expected = 'A: 5\nB: 3';
        expect(gameManager.printReserve()).to.equal(expected);
    });

    it('placeLetters works just fine', () => {
        const board = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, 'c', null, null, null],
            [null, null, null, null, 't', null, null],
            [null, null, null, 't', null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        const pointGrid = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 0, 0, 0],
            [0, 0, 2, 1, 2, 0, 0],
            [0, 2, 1, 3, 1, 2, 0],
            [0, 0, 2, 1, 2, 0, 0],
            [0, 0, 0, 2, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        gameManager.board.data = board;
        gameManager.board.pointGrid = pointGrid;

        const coord = { x: 3, y: 2 };
        const move: Move = { word: 'cat', coord, across: true };
        gameManager.moveGenerator.legalMoves.push(move);

        const player: Player = { name: 'player', easel: new Easel(['c', 'a']), score: 0 };
        const player2: Player = { name: 'player2', easel: new Easel(), score: 0 };
        gameManager.players.push(player);

        expect(gameManager.placeLetters(player2, move.word, move.coord, move.across)).to.equal(PlaceResult.NotCurrentPlayer);
        expect(gameManager.placeLetters(player, 'word', move.coord, move.across)).to.equal(PlaceResult.NotValid);
        expect(gameManager.placeLetters(player, move.word, move.coord, move.across)).to.equal(PlaceResult.Success);

        const expectedScore = 14;
        expect(player.score).to.equal(expectedScore);
    });

    it('readDictionary creates and fills a Trie', () => {
        const trie = gameManager.readDictionary('app/assets/test_dictionary.json');
        const expected = trie.contains('aa') && trie.contains('bb') && trie.contains('cc');
        expect(expected).to.equal(true);
    });

    it('isCentered returns correct value', () => {
        const word = 'mossy';
        const coordAcrossBefore = { x: 7, y: 0 };
        const coordAcrossCentered = { x: 7, y: 5 };
        const coordAcrossAfter = { x: 7, y: 9 };
        const coordDownBefore = { x: 0, y: 7 };
        const coordDownCentered = { x: 5, y: 7 };
        const coordDownAfter = { x: 9, y: 7 };

        expect(gameManager.isCentered(word, coordAcrossBefore, true)).to.equal(false);
        expect(gameManager.isCentered(word, coordAcrossCentered, true)).to.equal(true);
        expect(gameManager.isCentered(word, coordAcrossAfter, true)).to.equal(false);
        expect(gameManager.isCentered(word, coordDownBefore, false)).to.equal(false);
        expect(gameManager.isCentered(word, coordDownCentered, false)).to.equal(true);
        expect(gameManager.isCentered(word, coordDownAfter, false)).to.equal(false);
    });
});
