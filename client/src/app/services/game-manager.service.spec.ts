import { HttpClientTestingModule } from '@angular/common/http/testing';
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Easel } from '@app/classes/easel';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { PlayAction } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { VirtualPlayer } from '@app/classes/virtual-player';
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_SKIP_COUNT, SECOND_MD } from '@app/constants';
import { BehaviorSubject } from 'rxjs';
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
        // eslint-disable-next-line prettier/prettier
        TILES = [{ letter: 'a', points: 0 }, { letter: 'l', points: 0 }, { letter: 'l', points: 0 }, { letter: 'o', points: 0 },];
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

    it('should switch players after turn duration ', fakeAsync(() => {
        service.startTimer();
        tick(service.turnDuration * SECOND_MD);
        discardPeriodicTasks();
        expect(playerService.players[0].name).toEqual('player2');
    }));

    it('should get reserve count', () => {
        expect(service.reserveCount).toEqual(reserveService.tileCount);
    });

    it("shoud add tiles to player's easel", () => {
        const oldEaselSize = playerService.players[0].easel.count;
        service.giveTiles(playerService.players[0], 2);
        expect(playerService.players[0].easel.count).toEqual(oldEaselSize + 2);
    });

    it('should skip turn', () => {
        const oldSkipCounter = playerService.skipCounter;
        service.skipTurn();
        expect(playerService.skipCounter).toEqual(oldSkipCounter + 1);
    });
    it('should end game if skip counter equal six', () => {
        playerService.skipCounter = MAX_SKIP_COUNT - 1;
        service.skipTurn();
        expect(service.isEnded).toEqual(true);
    });
    it('should end game', () => {
        service.endGame();
        expect(service.isEnded).toEqual(true);
    });
    it('reset should clear board', () => {
        service.reset();
        expect(boardService.board).toHaveSize(0);
    });
    it('virtual player should exchange tiles', () => {
        const action = PlayAction.ExchangeTiles;
        const vPlayer = new VirtualPlayer('virtual', new Easel());
        vPlayer.play = jasmine.createSpy('play').and.returnValue(new BehaviorSubject<PlayAction>(action));
        const spyExchange = spyOn(service, 'exchangeTiles').and.callThrough();
        playerService.players[0] = vPlayer;
        service.playVirtualPlayer();
        expect(spyExchange).toHaveBeenCalled();
    });
    it('virtual player should skip turn if tile exchange is possible', () => {
        const action = PlayAction.ExchangeTiles;
        const vPlayer = new VirtualPlayer('virtual', new Easel());
        vPlayer.play = jasmine.createSpy('play').and.returnValue(new BehaviorSubject<PlayAction>(action));
        reserveService.isExchangePossible = jasmine.createSpy('isExchangePossible').and.returnValue(false);
        const spyPass = spyOn(service, 'skipTurn').and.callThrough();
        playerService.players[0] = vPlayer;
        service.playVirtualPlayer();
        expect(spyPass).toHaveBeenCalled();
    });
    it('virtual player should place tiles', () => {
        const action = PlayAction.PlaceTiles;
        const vPlayer = new VirtualPlayer('virtual', new Easel());
        vPlayer.play = jasmine.createSpy('play').and.returnValue(new BehaviorSubject<PlayAction>(action));
        const spyPlace = spyOn(vPlayer, 'place').and.callThrough();
        playerService.players[0] = vPlayer;
        service.playVirtualPlayer();
        expect(spyPlace).toHaveBeenCalled();
    });
    it('virtual player should place tile if word is valid', () => {
        const action = PlayAction.PlaceTiles;
        const vPlayer = new VirtualPlayer('virtual', new Easel());
        const placeTilesinfo = { word: 'test', coordStr: 'h8', vertical: true };
        vPlayer.play = jasmine.createSpy('play').and.returnValue(new BehaviorSubject<PlayAction>(action));
        vPlayer.place = jasmine.createSpy('place').and.returnValue(placeTilesinfo);
        const spyPlace = spyOn(service, 'placeTiles').and.callThrough();
        playerService.players[0] = vPlayer;
        service.playVirtualPlayer();
        expect(spyPlace).toHaveBeenCalled();
    });
    it('virtual player should place tile if word is not valid', () => {
        const action = PlayAction.PlaceTiles;
        const vPlayer = new VirtualPlayer('virtual', new Easel());
        const placeTilesinfo = { word: '', coordStr: 'h8', vertical: true };
        vPlayer.play = jasmine.createSpy('play').and.returnValue(new BehaviorSubject<PlayAction>(action));
        vPlayer.place = jasmine.createSpy('place').and.returnValue(placeTilesinfo);
        const spyPlace = spyOn(service, 'skipTurn').and.callThrough();
        playerService.players[0] = vPlayer;
        service.playVirtualPlayer();
        expect(spyPlace).toHaveBeenCalled();
    });
    it('virtual player should skip turn if playAction is pass', () => {
        const action = PlayAction.Pass;
        const vPlayer = new VirtualPlayer('virtual', new Easel());
        vPlayer.play = jasmine.createSpy('play').and.returnValue(new BehaviorSubject<PlayAction>(action));
        const spyPass = spyOn(service, 'skipTurn').and.callThrough();
        playerService.players[0] = vPlayer;
        service.playVirtualPlayer();
        expect(spyPass).toHaveBeenCalled();
    });
    it('activateDebug should give the expected results', () => {
        service.debug = true;
        expect(service.activateDebug()).toEqual('affichages de débogage désactivés');
        service.debug = false;
        expect(service.activateDebug()).toEqual('affichages de débogage activés');
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
        expect(JSON.stringify(playerService.current.easel.tiles) === JSON.stringify(TILES)).toBeFalse();
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
        // eslint-disable-next-line prettier/prettier
        const tiles: Tile[] = [{ letter: 'a', points: 0 }, { letter: 'l', points: 0 }, { letter: 'l', points: 0 }, { letter: '*', points: 0 },];
        playerService.current.easel = new Easel(tiles);
        service.placeTiles('allO', 'h8v', true, playerService.current);
        for (let i = 0; i < word.length; i++) {
            expect(boardService.getTile({ x: coord.x, y: coord.y + i })?.letter).toEqual(word[i]);
        }
    });

    it('placeTile should not allow a word to be placed if the letter of the tile on the board dont match the letter of the word', () => {
        const tiles: Tile[] = [
            // eslint-disable-next-line prettier/prettier
            { letter: 'l', points: 0 }, { letter: 'z', points: 0 }, { letter: 's', points: 0 }, { letter: 'a', points: 0 },];
        playerService.current.easel = new Easel(tiles);
        service.placeTiles('le', 'h8v', true, playerService.current);
        expect(service.placeTiles('sa', 'i8h', false, playerService.current)).toBe('placement de mot invalide');
    });

    it('placeTile should give as much tiles as possible if length of word placed is higher', () => {
        reserveService.tiles.clear();
        reserveService.tileCount = 0;
        reserveService.tiles.set('a', { tile: { letter: 'a', points: 0 }, count: 1 });
        const reserveTilesLength = reserveService.tiles.size;
        reserveService.tileCount = 1;
        playerService.current.easel = new Easel(TILES);
        const previousPlayer = playerService.current;
        service.placeTiles('allo', 'h8v', true, playerService.current);
        expect(previousPlayer.easel.tiles.length).toBe(reserveTilesLength);
        expect(previousPlayer.easel.tiles[0].letter).toBe('a');
    });

    it('placeTile not allow a word to be placed on top of another one', () => {
        playerService.current.easel = new Easel(TILES);
        service.placeTiles('la', 'h8v', true, playerService.current);
        expect(service.placeTiles('sa', 'i8v', true, playerService.current)).toBe('Commande impossible a realise');
    });
});
