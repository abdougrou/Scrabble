import { TestBed } from '@angular/core/testing';

import { PlaceTilesService } from './place-tiles.service';

describe('PlaceTilesService', () => {
    let service: PlaceTilesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaceTilesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
