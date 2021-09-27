import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Easel } from '@app/classes/easel';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@app/constants';
import { BoardService } from './board.service';
import { GameManagerService } from './game-manager.service';
import { GridService } from './grid.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { WordValidationService } from './word-validation.service';
import SpyObj = jasmine.SpyObj;

describe('GameManagerService', () => {
    let service: GameManagerService;
    let boardService: BoardService;
    let playerService: PlayerService;
    let reserveService: ReserveService;
    let gridService: GridService;
    let ctxStub: CanvasRenderingContext2D;
    let wordValidationMock: SpyObj<WordValidationService>;

    beforeEach(() => {
        boardService = new BoardService();
        reserveService = new ReserveService();
        playerService = new PlayerService();
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridService = new GridService(boardService);
        gridService.gridContext = ctxStub;
        wordValidationMock = jasmine.createSpyObj(WordValidationService, ['validateWords']);
        wordValidationMock.validateWords.and.returnValue(true);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: BoardService, useValue: boardService },
                { provide: ReserveService, useValue: reserveService },
                { provide: PlayerService, useValue: playerService },
                { provide: GridService, useValue: gridService },
                { provide: WordValidationService, useValue: wordValidationMock },
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
        const word = 'bonjour';
        const coordStr = 'h8';
        const coord = {
            x: 7,
            y: 7,
        };
        const vertical = false;
        const tiles: Tile[] = [
            { letter: 'b', points: 0 },
            { letter: 'n', points: 0 },
            { letter: 'o', points: 0 },
            { letter: 'r', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        boardService.placeTile({ x: 8, y: 7 }, { letter: 'o', points: 0 });
        boardService.placeTile({ x: 10, y: 7 }, { letter: 'j', points: 0 });
        boardService.placeTile({ x: 12, y: 7 }, { letter: 'u', points: 0 });
        service.placeTiles(word, coordStr, vertical, playerService.current);
        for (let i = 0; i < word.length; i++) {
            expect(boardService.getTile({ x: coord.x + i, y: coord.y })?.letter).toEqual(word[i]);
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
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 7 });
        reserveService.tileCount = 7;
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
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 7 });
        reserveService.tileCount = 7;
        service.exchangeTiles('allo', playerService.current);

        let test = '';
        for (const aTile of reserveService.tiles.keys()) {
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
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 2 });
        reserveService.tileCount = 2;
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
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 8 });
        reserveService.tileCount = 8;
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
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 8 });
        reserveService.tileCount = 8;
        service.exchangeTiles('allo', playerService.players[1]);
        expect(playerService.players[1].easel.toString()).toBe('allo');
    });

    it('getCoordinateFromString works as expected', () => {
        const coordStr1 = 'a1';
        const coordStr2 = 'o15v';
        const coordStr3 = 'z2';
        const coordStr4 = 'a7';
        const coordVec1: Vec2 = { x: 0, y: 0 };
        const coordVec2: Vec2 = { x: 14, y: 14 };
        const coordVec3: Vec2 = { x: 1, y: 25 };
        const coordVec4: Vec2 = { x: 6, y: 0 };
        expect(service.getCoordinateFromString(coordStr1)).toEqual(coordVec1);
        expect(service.getCoordinateFromString(coordStr2)).toEqual(coordVec2);
        expect(service.getCoordinateFromString(coordStr3)).toEqual(coordVec3);
        expect(service.getCoordinateFromString(coordStr4)).toEqual(coordVec4);
    });

    it('placeTiles should not allow player to play ', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];
        playerService.players[1].easel = new Easel(tiles);
        expect(service.placeTiles('allo', 'h8', true, playerService.players[1])).toBe("Ce n'est pas votre tour");
    });

    it('placeTiles should not allow player to place a tile outside of the board', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        expect(service.placeTiles('allo', 'o15', true, playerService.current)).toBe('Commande impossible a realise');
    });

    it('placetiles should not allow player to place tiles if each letters on the board dosent match the words wanted', () => {
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];
        const singleTile: Tile = {
            letter: 'b',
            points: 0,
        };
        playerService.current.easel = new Easel(tiles);
        boardService.placeTile({ x: 7, y: 9 }, singleTile);
        expect(service.placeTiles('allo', 'h8', true, playerService.current)).toBe('Commande impossible a realise');
    });

    it('should not allow player to place a word that is not contained in the dictionnary', () => {
        wordValidationMock.validateWords.and.returnValue(false);
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        expect(service.placeTiles('allo', 'h8', true, playerService.current)).toBe('le mot nest pas dans le dictionnaire');
        expect(playerService.current.easel.toString()).toBe('allo');
    });

    it('should not allow a player to place a word outside of the center of the board on the first turn', () => {
        wordValidationMock.validateWords.and.returnValue(false);
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        expect(service.placeTiles('allo', 'g7', true, playerService.current)).toBe('la position de votre mot nest pas valide');
    });
});
