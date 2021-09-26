import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { Tile } from '@app/classes/tile';
import { BoardService } from './board.service';
import { GameManagerService } from './game-manager.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

describe('GameManagerService', () => {
    let service: GameManagerService;
    let board: BoardService;
    let playerService: PlayerService;
    let reserve: ReserveService;

    beforeEach(() => {
        board = new BoardService();
        reserve = new ReserveService();
        playerService = new PlayerService();
        TestBed.configureTestingModule({
            providers: [
                { provide: BoardService, useValue: board },
                { provide: ReserveService, useValue: reserve },
                { provide: PlayerService, useValue: playerService },
            ],
        });
        service = TestBed.inject(GameManagerService);
        service.initialize({
            playerName1: 'player1',
            playerName2: 'player2',
            gameMode: GameMode.Classic,
            isMultiPlayer: false,
            dictionary: Dictionary.French,
            duration: 30,
            bonusEnabled: false,
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('placeTiles should place the tiles in the board', () => {
        const word = 'word';
        const coord = {
            x: 1,
            y: 1,
        };
        const vertical = false;
        const tiles: Tile[] = [
            { letter: 'w', points: 0 },
            { letter: 'o', points: 0 },
            { letter: 'r', points: 0 },
            { letter: 'd', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        service.placeTiles(word, coord, vertical, playerService.current);
        for (let i = 0; i < word.length; i++) {
            expect(board.getTile({ x: coord.x + i, y: coord.y })?.letter).toEqual(word[i]);
        }
    });
    it('placeTiles should place the tiles in the board', () => {
        const word = 'bonjour';
        const coord = {
            x: 1,
            y: 1,
        };
        const vertical = false;
        const tiles: Tile[] = [
            { letter: 'b', points: 0 },
            { letter: 'n', points: 0 },
            { letter: 'o', points: 0 },
            { letter: 'r', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        board.placeTile({ x: 2, y: 1 }, { letter: 'o', points: 0 });
        board.placeTile({ x: 4, y: 1 }, { letter: 'j', points: 0 });
        board.placeTile({ x: 6, y: 1 }, { letter: 'u', points: 0 });
        service.placeTiles(word, coord, vertical, playerService.current);
        for (let i = 0; i < word.length; i++) {
            expect(board.getTile({ x: coord.x + i, y: coord.y })?.letter).toEqual(word[i]);
        }
    });

    it('exchangeTiles should exchange letters with reserve', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 7 });
        reserve.tileCount = 7;
        service.exchangeTiles('allo', playerService.current);
        expect(playerService.current.easel.toString()).toBe('aaaa');
    });

    it('reserve should get tiles from easel after successful exchange', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 7 });
        reserve.tileCount = 7;
        service.exchangeTiles('allo', playerService.current);

        let test = '';
        for (const aTile of reserve.tiles.keys()) {
            test += aTile;
        }
        expect(test).toBe('alo');
    });

    it('exchangeTiles should not exchange letters with reserve if not enough tiles in reserve', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 2 });
        reserve.tileCount = 2;
        service.exchangeTiles('allo', playerService.current);
        expect(playerService.current.easel.toString()).toBe('allo');
    });

    it('exchangeTiles should not exchange letters when they are not in the easel', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.current.easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 8 });
        reserve.tileCount = 8;
        service.exchangeTiles('bonj', playerService.current);
        expect(playerService.current.easel.toString()).toBe('allo');
    });

    it('exchangeTiles should not exchange letters when they are not in the easel', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];

        playerService.players[1].easel = new Easel(tiles);
        reserve.tiles.clear();
        reserve.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 8 });
        reserve.tileCount = 8;
        service.exchangeTiles('allo', playerService.players[1]);
        expect(playerService.players[1].easel.toString()).toBe('allo');
    });
});
