import { TestBed } from '@angular/core/testing';

import { WordValidationService } from './word-validation.service';

describe('WordValidationService', () => {
    let service: WordValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordValidationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
