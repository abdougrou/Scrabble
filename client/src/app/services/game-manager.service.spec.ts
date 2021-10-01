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
    let TILES: Tile[];

    beforeEach(() => {
        boardService = new BoardService();
        reserveService = new ReserveService();
        playerService = new PlayerService();
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridService = new GridService(boardService);
        gridService.gridContext = ctxStub;
        wordValidationMock = jasmine.createSpyObj(WordValidationService, ['validateWords']);
        wordValidationMock.validateWords.and.returnValue(true);
        TILES = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];
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

    it('exchangeTiles should exchange letters with reserve', () => {
        playerService.current.easel = new Easel(TILES);
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 7 });
        reserveService.tileCount = 7;
        service.exchangeTiles('allo', playerService.current);
        //  Switch players back
        playerService.switchPlayers();
        expect(playerService.current.easel.toString()).toBe('aaaa');
    });

    it('reserve should get tiles from easel after successful exchange', () => {
        playerService.current.easel = new Easel(TILES);
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
        playerService.current.easel = new Easel(TILES);
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 2 });
        reserveService.tileCount = 2;
        service.exchangeTiles('allo', playerService.current);
        expect(playerService.current.easel.toString()).toBe('allo');
    });

    it('exchangeTiles should not exchange letters when they are not in the easel', () => {
        playerService.current.easel = new Easel(TILES);
        reserveService.tiles.clear();
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 2 }, count: 8 });
        reserveService.tileCount = 8;
        service.exchangeTiles('bonj', playerService.current);
        expect(playerService.current.easel.toString()).toBe('allo');
    });

    it('exchangeTiles should not exchange letters when they are not in the easel', () => {
        playerService.players[1].easel = new Easel(TILES);
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

    //  PlaceTiles function tests
    it('Should not place a word outside of the board', () => {
        const word = 'allo';
        playerService.current.easel = new Easel(TILES);
        expect(service.placeTiles(word, 'a15h', false, playerService.current)).toBe('placement de mot invalide');
        expect(boardService.getTile(service.getCoordinateFromString('a15h'))).toBe(undefined);
    });

    it('should not place a word that is not in contact with another one after the first turn', () => {
        const word = 'allo';
        playerService.current.easel = new Easel(TILES);
        boardService.placeTile({ x: 7, y: 7 }, { letter: 'a', points: 2 });
        expect(service.placeTiles(word, 'c4v', true, playerService.current)).toBe('placement de mot invalide');
        expect(boardService.getTile(service.getCoordinateFromString('c4v'))).toBe(undefined);
    });

    it('Should only validate a word placement on the first turn if a letter is placed on the center of the board', () => {
        const word = 'allo';
        playerService.current.easel = new Easel(TILES);
        expect(service.placeTiles(word, 'c4v', true, playerService.current)).toBe('placement de mot invalide');
        playerService.current.easel = new Easel(TILES);
        service.placeTiles(word, 'h8v', true, playerService.current);
        expect(boardService.getTile(service.getCoordinateFromString('h8v'))?.letter).toBe('a');
    });

    it('should only validate a placement if it is the players turn to play', () => {
        const word = 'allo';
        playerService.players[1].easel = new Easel(TILES);
        expect(service.placeTiles(word, 'h8v', true, playerService.players[1])).toBe("Ce n'est pas votre tour");
    });

    it('should remove tiles from the easel after placing them', () => {
        const word = 'allo';
        playerService.current.easel = new Easel(TILES);
        service.placeTiles(word, 'h8v', true, playerService.current);
        const oldTiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'o', points: 0 },
        ];
        expect(JSON.stringify(playerService.current.easel.tiles) === JSON.stringify(oldTiles)).toBeFalse();
    });

    it('should not place a word which is not in the dictionary', () => {
        wordValidationMock.validateWords.and.returnValue(false);
        const word = 'allo';
        playerService.current.easel = new Easel(TILES);
        expect(service.placeTiles(word, 'h8v', true, playerService.current)).toBe('le mot nest pas dans le dictionnaire');
    });

    it('should place a word made up of tiles from the easel and the board', () => {
        const word = 'test';
        const coord = {
            x: 7,
            y: 7,
        };
        const vertical = false;
        const tiles: Tile[] = [
            { letter: 't', points: 0 },
            { letter: 's', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        boardService.placeTile({ x: 8, y: 7 }, { letter: 'e', points: 0 });
        boardService.placeTile({ x: 10, y: 7 }, { letter: 't', points: 0 });
        service.placeTiles(word, 'h8h', vertical, playerService.current);
        for (let i = 0; i < word.length; i++) {
            expect(boardService.getTile({ x: coord.x + i, y: coord.y })?.letter).toEqual(word[i]);
        }
    });

    it('placeTile should detect upper case letters as white letters', () => {
        const word = 'allo';
        const coord = {
            x: 7,
            y: 7,
        };
        const tiles: Tile[] = [
            { letter: 'a', points: 0 },
            { letter: 'l', points: 0 },
            { letter: 'l', points: 0 },
            { letter: '*', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        service.placeTiles('allO', 'h8v', true, playerService.current);
        for (let i = 0; i < word.length; i++) {
            expect(boardService.getTile({ x: coord.x, y: coord.y + i })?.letter).toEqual(word[i]);
        }
    });

    it('placeTile should not allow a word to be placed if the letter of the tile on the board dont match the letter of the word', () => {
        const tiles: Tile[] = [
            { letter: 'l', points: 0 },
            { letter: 'z', points: 0 },
            { letter: 's', points: 0 },
            { letter: 'a', points: 0 },
        ];
        playerService.current.easel = new Easel(tiles);
        service.placeTiles('le', 'h8v', true, playerService.current);
        expect(service.placeTiles('sa', 'i8h', false, playerService.current)).toBe('placement de mot invalide');
    });
});
