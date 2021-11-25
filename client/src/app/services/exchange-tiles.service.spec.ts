import { TestBed } from '@angular/core/testing';
import { ExchangeTilesService } from './exchange-tiles.service';

describe('ExchangeTilesService', () => {
    let service: ExchangeTilesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExchangeTilesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
