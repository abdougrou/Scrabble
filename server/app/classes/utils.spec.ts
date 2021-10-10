import { expect } from 'chai';
import { coordToKey, keyToCoord } from './utils';

describe('Utils', () => {
    it('coordToKey returns correct string key', () => {
        const coord1 = { x: 0, y: 7 };
        const coord2 = { x: 7, y: 7 };
        const coord3 = { x: 11, y: 8 };
        const expectedCoord1 = '0.7';
        const expectedCoord2 = '7.7';
        const expectedCoord3 = '11.8';

        expect(coordToKey(coord1)).to.deep.equal(expectedCoord1);
        expect(coordToKey(coord2)).to.deep.equal(expectedCoord2);
        expect(coordToKey(coord3)).to.deep.equal(expectedCoord3);
    });

    it('keyToCoord returns correct Vec2 coordinate', () => {
        const coord1 = '0.7';
        const coord2 = '7.7';
        const coord3 = '11.8';
        const expectedCoord1 = { x: 0, y: 7 };
        const expectedCoord2 = { x: 7, y: 7 };
        const expectedCoord3 = { x: 11, y: 8 };

        expect(keyToCoord(coord1)).to.deep.equal(expectedCoord1);
        expect(keyToCoord(coord2)).to.deep.equal(expectedCoord2);
        expect(keyToCoord(coord3)).to.deep.equal(expectedCoord3);
    });
});
