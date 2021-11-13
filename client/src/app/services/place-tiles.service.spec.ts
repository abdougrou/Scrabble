import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Easel } from '@app/classes/easel';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { DOWN_ARROW, INVALID_COORDS, RIGHT_ARROW } from '@app/constants';
import { BoardService } from './board.service';
import { CalculatePointsService } from './calculate-points.service';
import { CommunicationService } from './communication.service';
import { ExchangeTilesService } from './exchange-tiles.service';
import { GameManagerInterfaceService } from './game-manager-interface.service';
import { GameManagerService } from './game-manager.service';
import { GridService } from './grid.service';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';
import { PlaceTilesService } from './place-tiles.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { WordValidationService } from './word-validation.service';
import SpyObj = jasmine.SpyObj;

describe('PlaceTilesService', () => {
    let service: PlaceTilesService;
    let gridServiceMock: SpyObj<GridService>;
    let boardService: BoardService;
    let playerService: PlayerService;
    let wordValidationMock: SpyObj<WordValidationService>;
    let calculatePoints: CalculatePointsService;
    let reserveService: ReserveService;
    let exchangeTiles: ExchangeTilesService;
    let gameManager: GameManagerService;
    let gameManagerInterface: GameManagerInterfaceService;
    let multiGameManager: MultiplayerGameManagerService;
    let communication: CommunicationService;
    let router: Router;
    let http: HttpClient;

    beforeEach(() => {
        gridServiceMock = jasmine.createSpyObj(GridService, ['drawBoard']);
        gridServiceMock.drawBoard.and.returnValue();
        boardService = new BoardService();
        playerService = new PlayerService();
        wordValidationMock = jasmine.createSpyObj(WordValidationService, ['validateWords']);
        wordValidationMock.validateWords.and.returnValue(true);
        calculatePoints = new CalculatePointsService(boardService);
        reserveService = new ReserveService();
        exchangeTiles = new ExchangeTilesService(reserveService, playerService);
        gameManager = new GameManagerService(
            boardService,
            reserveService,
            playerService,
            gridServiceMock,
            wordValidationMock,
            calculatePoints,
            exchangeTiles,
        );
        gameManager.initialize({
            playerName1: 'player1',
            playerName2: 'player2',
            gameMode: GameMode.Classic,
            isMultiPlayer: false,
            dictionary: Dictionary.French,
            duration: 30,
            bonusEnabled: false,
        });
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, HttpClientModule, RouterTestingModule],
            providers: [
                { provide: GridService, useValue: gridServiceMock },
                { provide: BoardService, useValue: boardService },
                { provide: PlayerService, useValue: playerService },
                { provide: WordValidationService, useValue: wordValidationMock },
                { provide: CalculatePointsService, useValue: calculatePoints },
                { provide: ReserveService, useValue: reserveService },
                { provide: GameManagerService, useValue: gameManager },
                { provide: GameManagerInterfaceService, useValue: gameManagerInterface },
                { provide: MultiplayerGameManagerService, useValue: multiGameManager },
                { provide: CommunicationService, useValue: communication },
            ],
        });
        service = TestBed.inject(PlaceTilesService);
        // eslint-disable-next-line deprecation/deprecation
        router = TestBed.get(Router);
        // eslint-disable-next-line deprecation/deprecation
        http = TestBed.get(HttpClient);
        communication = new CommunicationService(http);
        multiGameManager = new MultiplayerGameManagerService(gridServiceMock, communication, boardService, reserveService);
        gameManagerInterface = new GameManagerInterfaceService(gameManager, multiGameManager, playerService, router);
        gameManagerInterface.isMultiplayer = false;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should place the direction indicator on a valid tile if it is the main players turn', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.coords).toEqual(service.getBoardTileFromMouse(mouseCoords));
    });

    it('should change the direction when the player clicks on the same tile twice', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.tile).toEqual(RIGHT_ARROW);
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.tile).toEqual(DOWN_ARROW);
        service.manageClick(mouseCoords);
        expect(service.directionIndicator.tile).toEqual(RIGHT_ARROW);
    });

    it('should place an easel tile on the board', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        const easelTile: Tile = { letter: 'a', points: 1 };
        playerService.mainPlayer.easel = new Easel([easelTile]);
        service.manageKeyboard('a');
        const boardTile: Tile = boardService.getTile(service.getBoardTileFromMouse(mouseCoords)) as Tile;
        expect(boardTile).toEqual(easelTile);
    });

    it('should place a blank tile when the user inputs a capital letter', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        const easelTile: Tile = { letter: '*', points: 1 };
        playerService.mainPlayer.easel = new Easel([easelTile]);
        service.manageKeyboard('A');
        const boardTile: Tile = boardService.getTile(service.getBoardTileFromMouse(mouseCoords)) as Tile;
        expect(boardTile.letter).toEqual('a');
        expect(playerService.current.easel.tiles.length).toBe(0);
        service.manageKeyboard('Backspace');
        expect(boardService.getTile(service.getBoardTileFromMouse(mouseCoords))).toEqual(RIGHT_ARROW);
        expect(playerService.current.easel.tiles.length).toBe(1);
    });

    it('should end the placement when the player presses escape', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        const easelTile: Tile = { letter: 'a', points: 1 };
        playerService.mainPlayer.easel = new Easel([easelTile]);
        service.manageKeyboard('a');
        service.manageKeyboard('Escape');
        expect(boardService.getTile(service.getBoardTileFromMouse(mouseCoords))).toBeUndefined();
        expect(service.directionIndicator.coords).toEqual(INVALID_COORDS);
        expect(playerService.current.easel.tiles.length).toBe(1);
    });

    it('should permanently place the tiles when the player presses enter and the placement is valid', () => {
        const mouseCoords: Vec2 = { x: 300, y: 300 };
        service.manageClick(mouseCoords);
        const easelTile: Tile = { letter: 'a', points: 1 };
        playerService.mainPlayer.easel = new Easel([easelTile]);
        service.manageKeyboard('a');
        service.manageKeyboard('Enter');
        expect(playerService.current.name).not.toEqual(playerService.mainPlayer.name);
        playerService.switchPlayers();
        service.manageKeyboard('Escape');
        expect(boardService.getTile(service.getBoardTileFromMouse(mouseCoords))?.letter).toEqual('a');
    });

    it('should not place invalid tiles on the board after the player presses enter', () => {
        const mouseCoords: Vec2 = { x: 100, y: 100 };
        service.manageClick(mouseCoords);
        const easelTile: Tile = { letter: 'a', points: 1 };
        playerService.mainPlayer.easel = new Easel([easelTile]);
        service.manageKeyboard('a');
        service.manageKeyboard('Enter');
        playerService.switchPlayers();
        expect(boardService.getTile(service.getBoardTileFromMouse(mouseCoords))).toBeUndefined();
        boardService.placeTile({ x: 7, y: 7 }, { letter: 'a', points: 0 });
        service.manageClick(mouseCoords);
        service.manageKeyboard('a');
        service.manageKeyboard('Enter');
        playerService.switchPlayers();
        expect(boardService.getTile(service.getBoardTileFromMouse(mouseCoords))?.letter).toBeUndefined();
    });

    it('should not set the direction indicators position outside of the board', () => {
        const mouseCoords: Vec2 = { x: 550, y: 550 };
        service.manageClick(mouseCoords);
        const easelTile: Tile = { letter: 'a', points: 1 };
        playerService.mainPlayer.easel = new Easel([easelTile]);
        service.manageKeyboard('a');
        expect(service.directionIndicator.coords).toEqual(INVALID_COORDS);
    });
});
