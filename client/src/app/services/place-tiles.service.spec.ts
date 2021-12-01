import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { CANVAS_HEIGHT, CANVAS_WIDTH, DOWN_ARROW, INVALID_COORDS, RIGHT_ARROW } from '@app/constants';
import { Vec2 } from '@common/vec2';
import { BoardService } from './board.service';
import { GameManagerInterfaceService } from './game-manager-interface.service';
import { GridService } from './grid.service';
import { PlaceTilesService } from './place-tiles.service';

export class GameManagerInterfaceMock {
    mainPlayer: Player = { name: 'player', easel: new Easel(['a', 'b', 'c', 'd', 'e', 'f', '*']), score: 0, debug: false };
    secondaryPlayer = { name: 'player2', easel: new Easel(['a', 'b', 'c', 'd', 'e', 'f', 'g']), score: 0, debug: false };
    switched: boolean = false;

    getMainPlayer(): Player {
        return this.mainPlayer;
    }

    getCurrentPlayer(): Player {
        return this.switched ? this.secondaryPlayer : this.mainPlayer;
    }

    placeWord(word: string, coord: Vec2, vertical: boolean, player: Player) {
        console.log(word);
        console.log(coord);
        console.log(vertical);
        console.log(player);
    }

    switchPlayers() {
        this.switched = !this.switched;
    }
}

describe('PlaceTilesService', () => {
    let service: PlaceTilesService;
    let gridService: GridService;
    let boardService: BoardService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        boardService = new BoardService();
        gridService = new GridService(boardService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridService.gridContext = ctxStub;
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: GridService, useValue: gridService },
                { provide: BoardService, useValue: boardService },
                { provide: GameManagerInterfaceService, useClass: GameManagerInterfaceMock },
            ],
        });
        service = TestBed.inject(PlaceTilesService);
        boardService.initialize(false);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change the direction when the player clicks on the same tile twice', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.letter).toEqual(RIGHT_ARROW);
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.letter).toEqual(DOWN_ARROW);
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.letter).toEqual(RIGHT_ARROW);
    });

    it('should not place the direction indicator on top of a tile', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        boardService.setLetter(service.getBoardTileFromMouse(mouseCoords), 'a');
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.coords).toEqual(INVALID_COORDS);
    });

    it('should not change the direction indicators position once a tile has been placed', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        const secondCoords: Vec2 = { x: 400, y: 300 };
        service.manageClick(mouseCoords);
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.coords).toEqual(service.getBoardTileFromMouse(mouseCoords));
        service.tilesPlacedOnBoard.push({ coords: { x: 1, y: 2 }, letter: 'a' });
        service.manageClick(secondCoords);
        expect(service.directionIndicator.coords).toEqual(service.getBoardTileFromMouse(mouseCoords));
    });

    it('should change the position of the indicator if the player clicks on another empty tile', () => {
        const firstMouseCoord: Vec2 = { x: 300, y: 300 };
        const secondMouseCoord: Vec2 = { x: 400, y: 300 };
        service.manageClick(firstMouseCoord);
        service.manageClick(secondMouseCoord);
        expect(boardService.getLetter(service.getBoardTileFromMouse(firstMouseCoord))).toEqual('');
        expect(boardService.getLetter(service.getBoardTileFromMouse(secondMouseCoord))).toEqual(RIGHT_ARROW);
    });

    it('should place an easel tile on the board', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        service.manageKeyboard('a');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual('a');
    });

    it('should place a blank tile when the user inputs a capital letter', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        service.manageKeyboard('Backspace');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual(RIGHT_ARROW);
        service.manageKeyboard('A');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual('a');
        service.manageKeyboard('Backspace');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual(RIGHT_ARROW);
    });

    it('should end the placement when the player presses escape', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        service.manageKeyboard('a');
        service.manageKeyboard('Escape');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual('');
        expect(service.directionIndicator.coords).toEqual(INVALID_COORDS);
    });

    it('should call placeWord when the player presses enter and the placement is valid', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        const spy = spyOn(service.generalGameManager, 'placeWord');

        boardService.setLetter({ x: 6, y: 7 }, 'z');
        service.manageClick(mouseCoords);
        service.manageKeyboard('a');
        service.manageKeyboard('Enter');
        expect(spy).toHaveBeenCalled();
    });

    it('should give invalid coordinates to the direction indicator once it reaches the end of the board', () => {
        const mouseCoords: Vec2 = { x: 400, y: 400 };

        service.manageClick(mouseCoords);
        service.manageClick(mouseCoords);
        service.manageKeyboard('a');
        service.manageKeyboard('b');
        service.manageKeyboard('c');
        service.manageKeyboard('d');
        service.manageKeyboard('e');
        expect(service.directionIndicator.coords).toEqual(INVALID_COORDS);
    });

    it('should not place a tile if it is not the players turn', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.generalGameManager.switchPlayers();

        service.manageClick(mouseCoords);
        service.manageKeyboard('a');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual(null);
    });

    it('should not place a letter if the player has not selected a tile on the board', () => {
        service.manageKeyboard('a');
        expect(service.tilesPlacedOnBoard.length).toEqual(0);
    });

    it('should not let the player place a *', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        service.manageKeyboard('*');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual(RIGHT_ARROW);
    });

    it('should not let the player place a tile which is not in his easel', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        service.manageKeyboard('x');
        expect(boardService.getLetter(service.getBoardTileFromMouse(mouseCoords))).toEqual(RIGHT_ARROW);
    });

    it('should not return an invalid coordinate for the words first letter when it is at the beginning of the board', () => {
        service.tilesPlacedOnBoard.push({ coords: { x: 0, y: 7 }, letter: 'a' });
        expect(service.getFirstLetterPosition(false)).toEqual({ x: 0, y: 7 });

        service.tilesPlacedOnBoard.pop();
        service.tilesPlacedOnBoard.push({ coords: { x: 7, y: 0 }, letter: 'a' });
        expect(service.getFirstLetterPosition(true)).toEqual({ x: 7, y: 0 });

        service.tilesPlacedOnBoard.pop();
        boardService.setLetter({ x: 7, y: 2 }, 'b');
        service.tilesPlacedOnBoard.push({ coords: { x: 7, y: 3 }, letter: 'a' });
        expect(service.getFirstLetterPosition(true)).toEqual({ x: 7, y: 2 });
    });

    it('should return the full word starting at a coordinate', () => {
        boardService.setLetter({ x: 7, y: 2 }, 'b');
        boardService.setLetter({ x: 7, y: 3 }, 'z');
        expect(service.getFullWord({ x: 7, y: 2 }, true)).toEqual('bz');
    });

    it('should return false when there are no empty tiles', () => {
        boardService.setLetter({ x: 13, y: 7 }, 'a');
        boardService.setLetter({ x: 14, y: 7 }, 'a');
        service.directionIndicator.letter = RIGHT_ARROW;
        service.directionIndicator.coords = { x: 12, y: 7 };
        expect(service.findNextEmptyTile()).toEqual(false);
    });
});
