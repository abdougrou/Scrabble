import { WordValidationService } from '@app/services/word-validation.service';
import { Easel } from './easel';
import { VirtualPlayer } from './virtual-player';

describe('VirtualPlayer', () => {
    let virtualPlayer: VirtualPlayer;
    let wordValidationMock: jasmine.SpyObj<WordValidationService>;

    beforeEach(() => {
        virtualPlayer = new VirtualPlayer('virtual', new Easel());
        wordValidationMock = jasmine.createSpyObj(WordValidationService, ['validateWords', 'getPossibleWords']);
        wordValidationMock.validateWords.and.returnValue(1);
        virtualPlayer.easel.addTiles([
            { letter: 'a', points: 1 },
            { letter: 'o', points: 2 },
        ]);
    });
    it('should create an instance', () => {
        expect(new VirtualPlayer('virtual', new Easel())).toBeTruthy();
    });

    it('test 2', () => {
        virtualPlayer.place(wordValidationMock);
        expect(wordValidationMock.validateWords).toHaveBeenCalledTimes(1);
    });
});
