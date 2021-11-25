import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, tick } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { GameMode, LobbyConfig } from '@common/lobby-config';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';

describe('MultiplayerGameManagerService', () => {
    let service: MultiplayerGameManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        service = TestBed.inject(MultiplayerGameManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize', () => {
        const lobby: LobbyConfig = { host: '', key: '', gameMode: GameMode.Classic, bonusEnabled: false, turnDuration: 60, dictionary: '' };
        const playerName = '';
        const spyUpdate = spyOn(service.communication, 'update').and.callThrough();
        const spyStartTimer = spyOn(service, 'startTimer').and.callThrough();
        service.initialize(lobby, playerName);
        expect(spyUpdate).toHaveBeenCalled();
        expect(spyStartTimer).toHaveBeenCalled();
    });

    it('should get main player', () => {
        service.players = [
            { name: '1', easel: new Easel(), score: 0, debug: false },
            { name: '2', easel: new Easel(), score: 0, debug: false },
        ];
        service.mainPlayerName = '1';
        const player: Player = service.getMainPlayer();
        expect(player).toBe(service.players[0]);
    });

    it('should update', () => {
        const spyUpdate = spyOn(service.communication, 'update').and.callThrough();
        const spyDrawBoard = spyOn(service.gridService, 'drawBoard').and.callThrough();
        service.update();
        expect(spyUpdate).toHaveBeenCalled();
        expect(spyDrawBoard).toHaveBeenCalled();
    });

    it('should emit changes', () => {
        const spyNext = spyOn(service.updatePlayer, 'next').and.callThrough();
        service.emitChanges();
        expect(spyNext).toHaveBeenCalled();
    });

    it('should start timer', () => {
        const spySwitchPlayers = spyOn(service, 'switchPlayers').and.callThrough();
        service.turnDurationLeft = 30;
        service.startTimer();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        tick(30);
        expect(spySwitchPlayers).toHaveBeenCalled();
    });

    it('should switch players', () => {
        const spySwitchPlayers = spyOn(service.communication, 'switchPlayers').and.callThrough();
        service.switchPlayers();
        expect(spySwitchPlayers).toHaveBeenCalled();
    });

    it('should exchange letters', () => {
        const letters = '';
        const player = { name: '1', easel: new Easel(), score: 0, debug: false };
        const spyExchangeLetters = spyOn(service.communication, 'exchangeLetters').and.callThrough();
        service.exchangeLetters(letters, player);
        expect(spyExchangeLetters).toHaveBeenCalled();
    });

    it('should skip turn', () => {
        service.players = [{ name: '1', easel: new Easel(), score: 0, debug: false }];
        const spySkipTurn = spyOn(service.communication, 'skipTurn').and.callThrough();
        service.skipTurn();
        expect(spySkipTurn).toHaveBeenCalled();
    });

    it('should place letterss', () => {
        const word = '';
        const coordStr = '';
        const vertical = false;
        const player = { name: '1', easel: new Easel(), score: 0, debug: false };
        const spyPlaceLetters = spyOn(service.communication, 'placeLetters').and.callThrough();
        const spyDrawBoard = spyOn(service.gridService, 'drawBoard').and.callThrough();
        service.placeLetters(word, coordStr, vertical, player);
        expect(spyPlaceLetters).toHaveBeenCalled();
        expect(spyDrawBoard).toHaveBeenCalled();
    });

    it('should play mouse letters', () => {
        const word = '';
        const coord: Vec2 = { x: 0, y: 0 };
        const vertical = false;
        const player = { name: '1', easel: new Easel(), score: 0, debug: false };
        const spyPlaceLetters = spyOn(service.communication, 'placeLetters').and.callThrough();
        const spyDrawBoard = spyOn(service.gridService, 'drawBoard').and.callThrough();
        service.placeMouseLetters(word, coord, vertical, player);
        expect(spyPlaceLetters).toHaveBeenCalled();
        expect(spyDrawBoard).toHaveBeenCalled();
        expect(service).toBeTruthy();
    });
});
