import { TestBed } from '@angular/core/testing';

import { CommandHandlerService } from './command-handler.service';

describe('CommandHandlerService', () => {
    let service: CommandHandlerService;
    const exchangeGood = '!exchange a';
    const exchangeGoodStar = '!exchange *';
    const exchangeWrong = 'echange q';
    const placeGood = '!place a10v allo';
    const placeCapital = '!place c2h deVoir';
    const placeWrong = '!place p10h run';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should be the good command', () => {
        expect(service.exchange(exchangeGood)).toBe('!exchange a');
        expect(service.exchange(exchangeGoodStar)).toBe('!exchange *');
        expect(service.exchange(exchangeWrong)).toBe('INVALID COMMAND');
        expect(service.place(placeGood)).toBe('!place a10v allo');
        expect(service.place(placeCapital)).toBe('!place c2h deVoir');
        expect(service.place(placeWrong)).toBe('INVALID COMMAND');
    });
});
