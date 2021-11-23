import { TestBed } from '@angular/core/testing';
import { PlayAction } from '@app/classes/virtual-player';
import { MoveGeneratorService } from './move-generator.service';
import { VirtualPlayerService } from './virtual-player.service';

describe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let moveGenerator: MoveGeneratorService;

    beforeEach(() => {
        moveGenerator = new MoveGeneratorService();
        moveGenerator.legalMoves.length = 6;
        TestBed.configureTestingModule({
            providers: [{ provide: MoveGeneratorService, useValue: moveGenerator }],
        });
        service = TestBed.inject(VirtualPlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('beginnerChoose should return Observable with PlayAction.Pass', () => {
        const passChance = 0.0;
        spyOn(Math, 'random').and.returnValue(passChance);
        const observable = service.beginnerChoose();
        observable.toPromise().then((action) => {
            expect(action).toEqual(PlayAction.Pass);
        });
    });

    it('beginnerChoose should return Observable with PlayAction.Exchange', () => {
        const exchangeChance = 0.11;
        spyOn(Math, 'random').and.returnValue(exchangeChance);
        const observable = service.beginnerChoose();
        observable.toPromise().then((action) => {
            expect(action).toEqual(PlayAction.Exchange);
        });
    });

    it('beginnerChoose should return Observable with PlayAction.Place', () => {
        const placeChance = 0.3;
        spyOn(Math, 'random').and.returnValue(placeChance);
        const observable = service.beginnerChoose();
        observable.toPromise().then((action) => {
            expect(action).toEqual(PlayAction.Place);
        });
    });
});
