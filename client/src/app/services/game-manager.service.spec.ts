import { TestBed } from '@angular/core/testing';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { GameManagerService } from './game-manager.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

describe('GameManagerService', () => {
    let service: GameManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ReserveService, useValue: new ReserveService() },
                { provide: PlayerService, useValue: new PlayerService() },
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
});
