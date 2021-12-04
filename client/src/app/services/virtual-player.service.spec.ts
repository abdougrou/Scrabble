import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { PlayAction } from '@app/classes/virtual-player';
import { STARTING_LETTER_AMOUNT } from '@app/constants';
import { BoardService } from './board.service';
import { MoveGeneratorService } from './move-generator.service';
import { ReserveService } from './reserve.service';
import { VirtualPlayerService } from './virtual-player.service';

describe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let moveGenerator: MoveGeneratorService;
    let board: BoardService;
    let reserve: ReserveService;

    beforeEach(() => {
        board = new BoardService();
        reserve = new ReserveService();
        moveGenerator = new MoveGeneratorService(board);
        TestBed.configureTestingModule({
            providers: [
                { provide: MoveGeneratorService, useValue: moveGenerator },
                { provide: ReserveService, useValue: reserve },
            ],
        });
        service = TestBed.inject(VirtualPlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('beginnerChoose should return Observable with PlayAction.Pass', (done) => {
        const passChance = 0.0;
        spyOn(Math, 'random').and.returnValue(passChance);
        const result = service.beginnerChoose(reserve, moveGenerator.legalMoves);
        result.subscribe((action) => {
            expect(action).toEqual(PlayAction.Pass);
            done();
        });
    });

    it('beginnerChoose should return Observable with PlayAction.Exchange', (done) => {
        const exchangeChance = 0.11;
        spyOn(Math, 'random').and.returnValue(exchangeChance);
        const result = service.beginnerChoose(reserve, moveGenerator.legalMoves);
        result.subscribe((action) => {
            expect(action).toEqual(PlayAction.Exchange);
            done();
        });
    });

    it('beginnerChoose should return Observable with PlayAction.Place', (done) => {
        const placeChance = 0.3;
        spyOn(Math, 'random').and.returnValue(placeChance);
        moveGenerator.legalMoves.length = 5;
        const result = service.beginnerChoose(reserve, moveGenerator.legalMoves);
        result.subscribe((action) => {
            expect(action).toEqual(PlayAction.Place);
            done();
        });
    });

    it('expertChoose should return Observable with PlayAction.Pass when it can not place or exchange', (done) => {
        reserve.size = 0;
        const result = service.expertChoose(reserve, moveGenerator.legalMoves);
        result.subscribe((action) => {
            expect(action).toEqual(PlayAction.Pass);
            done();
        });
    });

    it('expertChoose should return Observable with PlayAction.Exchange when it can not place a word but can exchange', (done) => {
        const result = service.expertChoose(reserve, moveGenerator.legalMoves);
        result.subscribe((action) => {
            expect(action).toEqual(PlayAction.Exchange);
            done();
        });
    });

    it('expertChoose should return Observable with PlayAction.Place when it can place a word', (done) => {
        moveGenerator.legalMoves.length = 5;
        const result = service.expertChoose(reserve, moveGenerator.legalMoves);
        result.subscribe((action) => {
            expect(action).toEqual(PlayAction.Place);
            done();
        });
    });

    it('expertExchange should exchange the maximum amount of letters possible', () => {
        service.setupVirtualPlayer('virtualPlayer', new Easel(['a', 'b', 'c', 'd', 'e', 'f', 'g']), 0, true);
        reserve.size = 8;
        const result = service.expertExchange(reserve);
        expect(result.length).toEqual(STARTING_LETTER_AMOUNT);
    });
});
