import { TestBed } from '@angular/core/testing';
import { ModeSelectionService } from './mode-selection.service';

describe('ModeSelectionService', () => {
    let service: ModeSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ModeSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
