import { TestBed } from '@angular/core/testing';
import { GameManagerInterfaceService } from './game-manager-interface.service';

describe('GameManagerInterfaceService', () => {
    let service: GameManagerInterfaceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameManagerInterfaceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
