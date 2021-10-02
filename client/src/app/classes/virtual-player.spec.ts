import { BoardService } from '@app/services/board.service';
import { CalculatePointsService } from '@app/services/calculate-points.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { Easel } from './easel';
import { VirtualPlayer } from './virtual-player';

describe('VirtualPlayer', () => {
    let virtualPlayer: VirtualPlayer;
    let wordValidationMock: jasmine.SpyObj<WordValidationService>;
    let board: BoardService;
    let calculatePoints: CalculatePointsService;

    beforeEach(() => {
        board = new BoardService();
        calculatePoints = new CalculatePointsService(board);
        virtualPlayer = new VirtualPlayer('virtual', new Easel());
        wordValidationMock = jasmine.createSpyObj(WordValidationService, ['validateWords', 'getPossibleWords']);
        wordValidationMock.validateWords.and.returnValue(true);
        wordValidationMock.getPossibleWords.and.returnValue([
            {
                word: 'zoo',
                tileCoords: [{ tile: { letter: 'o', points: 1 }, coords: { x: 9, y: 7 } }],
                vertical: false,
                points: 3,
            },
        ]);
        virtualPlayer.easel.addTiles([
            { letter: 'a', points: 1 },
            { letter: 'o', points: 2 },
        ]);
    });
    it('should create an instance', () => {
        expect(new VirtualPlayer('virtual', new Easel())).toBeTruthy();
    });

    it('Echange should return a string of letters', () => {
        const tilesExchanged = virtualPlayer.exchange();
        expect(tilesExchanged.length).toBeGreaterThan(0);
    });

    it('PlaceTiles returns possible placements', () => {
        board.placeTile({ x: 7, y: 7 }, { letter: 'n', points: 1 });
        board.placeTile({ x: 8, y: 7 }, { letter: 'o', points: 1 });
        virtualPlayer.easel.addTiles([
            { letter: 'n', points: 1 },
            { letter: 'o', points: 1 },
        ]);
        const functionReturn = virtualPlayer.place(wordValidationMock, calculatePoints, board);
        expect(functionReturn).toBeTruthy();
    });

    it('PlaceTiles should go through', () => {
        board.placeTile({ x: 3, y: 7 }, { letter: 'b', points: 1 });
        board.placeTile({ x: 4, y: 7 }, { letter: 'o', points: 1 });
        board.placeTile({ x: 5, y: 7 }, { letter: 'n', points: 1 });
        board.placeTile({ x: 6, y: 7 }, { letter: 'j', points: 1 });
        board.placeTile({ x: 7, y: 7 }, { letter: 'o', points: 1 });
        board.placeTile({ x: 8, y: 7 }, { letter: 'u', points: 1 });
        board.placeTile({ x: 9, y: 7 }, { letter: 'r', points: 1 });
        virtualPlayer.easel.addTiles([
            { letter: 'n', points: 1 },
            { letter: 'o', points: 1 },
            { letter: 'o', points: 1 },
            { letter: 'e', points: 1 },
            { letter: 'u', points: 1 },
            { letter: 'r', points: 1 },
            { letter: 'a', points: 1 },
            { letter: 'i', points: 1 },
            { letter: 's', points: 1 },
            { letter: 'b', points: 1 },
            { letter: 'm', points: 1 },
            { letter: 'n', points: 1 },
        ]);
        const spy = spyOn(virtualPlayer, 'place').and.callThrough();
        const spyPoints = spyOn(calculatePoints, 'calculatePoints').and.callThrough();
        const functionReturn = virtualPlayer.place(wordValidationMock, calculatePoints, board);
        expect(spy).toHaveBeenCalled();
        expect(spyPoints).toHaveBeenCalled();
        expect(functionReturn).toBeTruthy();
    });

    it('PlaceTiles should call calculatePoints', () => {
        board.placeTile({ x: 3, y: 7 }, { letter: 'b', points: 0 });
        board.placeTile({ x: 4, y: 7 }, { letter: 'o', points: 0 });
        board.placeTile({ x: 5, y: 7 }, { letter: 'n', points: 0 });
        board.placeTile({ x: 6, y: 7 }, { letter: 'j', points: 0 });
        board.placeTile({ x: 7, y: 7 }, { letter: 'o', points: 0 });
        board.placeTile({ x: 8, y: 7 }, { letter: 'u', points: 0 });
        board.placeTile({ x: 9, y: 7 }, { letter: 'r', points: 0 });
        virtualPlayer.easel.addTiles([
            { letter: 'n', points: 0 },
            { letter: 'o', points: 0 },
            { letter: 'o', points: 0 },
            { letter: 'e', points: 0 },
            { letter: 'u', points: 0 },
            { letter: 'r', points: 0 },
            { letter: 'a', points: 0 },
            { letter: 'i', points: 0 },
            { letter: 's', points: 0 },
            { letter: 'b', points: 0 },
            { letter: 'm', points: 0 },
            { letter: 'n', points: 0 },
        ]);
        const spy = spyOn(virtualPlayer, 'place').and.callThrough();
        const spyPoints = spyOn(calculatePoints, 'calculatePoints').and.callThrough();
        const functionReturn = virtualPlayer.place(wordValidationMock, calculatePoints, board);
        expect(spy).toHaveBeenCalled();
        expect(spyPoints).toHaveBeenCalled();
        expect(functionReturn).toBeTruthy();
    });

    it('play calls skip', () => {
        const skipChance = 0.0;
        // const exchangeChange = 0.1;
        // const placeChance = 0.2;
        spyOn(Math, 'random').and.returnValue(skipChance);
        const action = virtualPlayer.play();
        expect(action).toBeTruthy();
    });

    it('play calls exchange', () => {
        const exchangeChange = 0.1;
        spyOn(Math, 'random').and.returnValue(exchangeChange);
        const action = virtualPlayer.play();
        expect(action).toBeTruthy();
    });

    it('play calls place', () => {
        const placeChance = 0.2;
        spyOn(Math, 'random').and.returnValue(placeChance);
        const action = virtualPlayer.play();
        expect(action).toBeTruthy();
    });
});
