import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_HEIGHT, CANVAS_WIDTH, STEP, TILE_COLORS, LETTER_FONT_SIZE_MODIFIER } from '@app/constants';
import { GridService } from '@app/services/grid.service';
import { BoardService } from './board.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;
    let boardService: BoardService;

    beforeEach(() => {
        boardService = new BoardService();
        TestBed.configureTestingModule({
            providers: [{ provide: BoardService, useValue: boardService }],
        });
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it('height should return the height of the grid canvas', () => {
        expect(service.height).toEqual(CANVAS_HEIGHT);
    });

    it('drawGridIds should call fillText() 30 times', () => {
        const timesCalled = 30;
        const spy = spyOn(ctxStub, 'fillText').and.callThrough();
        service.drawGridIds();

        expect(spy).toHaveBeenCalledTimes(timesCalled);
    });

    it('colorTile should call rect() with right parameters', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const canvasCoord: Vec2 = { x: matrixCoord.x * STEP, y: matrixCoord.y * STEP };
        const colorTile = 'black';
        const spy = spyOn(ctxStub, 'rect').and.callThrough();
        service.colorTile(matrixCoord, colorTile);

        expect(spy).toHaveBeenCalledWith(canvasCoord.x, canvasCoord.y, STEP - 1, STEP - 1);
    });

    it('colorTile should color with right color', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const colorTile = '#000000';
        service.colorTile(matrixCoord, colorTile);

        expect(ctxStub.fillStyle).toBe('#000000');
    });

    it('drawMultiplierTile should draw basic tile', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const color = TILE_COLORS.tile;
        const multiplier = 0;
        const spy = spyOn(service, 'colorTile').and.callThrough();
        service.drawMultiplierTile(matrixCoord, multiplier);

        expect(spy).toHaveBeenCalledWith(matrixCoord, color);
    });

    it('drawMultiplierTile should draw l2 tile', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const color = TILE_COLORS.l2;
        const multiplier = 1;
        const spy = spyOn(service, 'colorTile').and.callThrough();
        service.drawMultiplierTile(matrixCoord, multiplier);

        expect(spy).toHaveBeenCalledWith(matrixCoord, color);
    });

    it('drawMultiplierTile should draw l3 tile', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const color = TILE_COLORS.l3;
        const multiplier = 2;
        const spy = spyOn(service, 'colorTile').and.callThrough();
        service.drawMultiplierTile(matrixCoord, multiplier);

        expect(spy).toHaveBeenCalledWith(matrixCoord, color);
    });

    it('drawMultiplierTile should draw w2 tile', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const color = TILE_COLORS.w2;
        const multiplier = 3;
        const spy = spyOn(service, 'colorTile').and.callThrough();
        service.drawMultiplierTile(matrixCoord, multiplier);

        expect(spy).toHaveBeenCalledWith(matrixCoord, color);
    });

    it('drawMultiplierTile should draw w3 tile', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const color = TILE_COLORS.w3;
        const multiplier = 4;
        const spy = spyOn(service, 'colorTile').and.callThrough();
        service.drawMultiplierTile(matrixCoord, multiplier);

        expect(spy).toHaveBeenCalledWith(matrixCoord, color);
    });

    it('drawTile should call fillText 2 times', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const tile: Tile = { letter: 'A', points: 10 };
        const spy = spyOn(ctxStub, 'fillText').and.callThrough();
        service.drawTile(matrixCoord, tile, LETTER_FONT_SIZE_MODIFIER);

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('drawTile should call colorTile 1 time', () => {
        const matrixCoord: Vec2 = { x: 20, y: 20 };
        const tile: Tile = { letter: 'A', points: 10 };
        const spy = spyOn(service, 'colorTile').and.callThrough();
        service.drawTile(matrixCoord, tile, LETTER_FONT_SIZE_MODIFIER);

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('no word, drawBoard should call 30 multiplier tiles and 0 placed tiles', () => {
        const spyPlaced = spyOn(service, 'drawTile').and.callThrough();
        const spyVirgin = spyOn(service, 'drawMultiplierTile').and.callThrough();
        const numberOfPlacedTilesExpected = 0;
        const numberOfVirginTilesExpected = 225;
        service.drawBoard();

        expect(spyPlaced).toHaveBeenCalledTimes(numberOfPlacedTilesExpected);
        expect(spyVirgin).toHaveBeenCalledTimes(numberOfVirginTilesExpected);
    });

    it('after drawing a 4 letter word, drawBoard should call 30 multiplier tiles and 0 placed tiles', () => {
        const spyPlaced = spyOn(service, 'drawTile').and.callThrough();
        const spyVirgin = spyOn(service, 'drawMultiplierTile').and.callThrough();

        const numberOfPlacedTilesExpected = 4;
        const numberOfVirginTilesExpected = 221;
        boardService.placeTile({ x: 7, y: 7 }, { letter: 'a', points: 1 });
        boardService.placeTile({ x: 7, y: 8 }, { letter: 'a', points: 1 });
        boardService.placeTile({ x: 7, y: 9 }, { letter: 'a', points: 1 });
        boardService.placeTile({ x: 7, y: 10 }, { letter: 'a', points: 1 });
        service.drawBoard();

        expect(spyPlaced).toHaveBeenCalledTimes(numberOfPlacedTilesExpected);
        expect(spyVirgin).toHaveBeenCalledTimes(numberOfVirginTilesExpected);
    });

    it('clearBoard() should clear board by calling clearRect', () => {
        const boardSize = CANVAS_WIDTH - STEP;
        const spy = spyOn(ctxStub, 'clearRect').and.callThrough();
        service.clearBoard();

        expect(spy).toHaveBeenCalledWith(0, 0, boardSize, boardSize);
    });

    it('drawMultiplierText should draw a star in the middle of the board', () => {
        const middleCoord: Vec2 = { x: 7, y: 7 };
        const multiplierType = 'MOT';
        const multiplier = 2;
        const spy = spyOn(service, 'drawStarCenter').and.callThrough();
        service.drawMultiplierText(middleCoord, multiplierType, multiplier);

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('drawMultiplierText should draw a star in the middle of the board', () => {
        const middleCoord: Vec2 = { x: 7, y: 7 };
        const multiplierType = 'MOT';
        const multiplier = 2;
        const spy = spyOn(service, 'drawStarCenter').and.callThrough();
        service.drawMultiplierText(middleCoord, multiplierType, multiplier);

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Multiplicator tiles should be drawn everywhere except the middle', () => {
        const numberCalled = 120;
        const spy = spyOn(ctxStub, 'fillText').and.callThrough();
        service.drawBoard();

        expect(spy).toHaveBeenCalledTimes(numberCalled);
    });
});
