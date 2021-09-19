import { TestBed } from '@angular/core/testing';
import { GameManagerService } from './game-manager.service';
import { ReserveService } from './reserve.service';

const STARTING_TILE_AMOUNT = 7;

describe('GameManagerService', () => {
    let service: GameManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ReserveService }],
        });
        service = TestBed.inject(GameManagerService);
        service.initialize({
            playerName1: 'player1',
            playerName2: 'player2',
            dictionary: 'Dictionary',
            duration: 30,
            bonusEnabled: false,
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('reserve initialization', () => {
        expect(service.reserve).toBeTruthy();
    });

    it('player initialization', () => {
        expect(service.players[0].name).toBeTruthy();
        expect(service.players[1].name).toBeTruthy();
    });

    it('invert current player', () => {
        const player1 = service.players[0];
        const player2 = service.players[1];

        service.switchPlayer();
        expect(service.currentPlayer).toBe(player2);
        service.switchPlayer();
        expect(service.currentPlayer).toBe(player1);
    });

    it('players have correct amount of starting tiles', () => {
        expect(service.players[0].easel.count).toBe(STARTING_TILE_AMOUNT);
        expect(service.players[1].easel.count).toBe(STARTING_TILE_AMOUNT);
    });
});
