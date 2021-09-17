import { TestBed } from '@angular/core/testing';
import { GameManagerService } from './game-manager.service';

const STARTING_TILE_AMOUNT = 7;

describe('GameManagerService', () => {
    let service: GameManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameManagerService);
        service.initialize({
            playerName1: 'Player1',
            playerName2: 'Player2',
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
        service.initializePlayers(['Player1', 'Player2'], 0);
        expect(service.currentPlayer.name).toBe('Player1');
        service.initializePlayers(['Player1', 'Player2'], 1);
        expect(service.currentPlayer.name).toBe('Player2');
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
