import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameManagerInterfaceService } from './game-manager-interface.service';

describe('GameManagerInterfaceService', () => {
    let service: GameManagerInterfaceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [],
        });
        service = TestBed.inject(GameManagerInterfaceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
