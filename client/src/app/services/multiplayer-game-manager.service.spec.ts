import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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
});
