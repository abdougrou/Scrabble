import { ReserveTile, Tile } from '@app/classes/tile';

const MIN_EXCHANGE_RESERVE_COUNT = 7;

export class Reserve {
    tiles: Map<string, ReserveTile> = new Map<string, ReserveTile>();
    tileCount: number = 0;

    constructor() {
        const lettersData: string[] = CLASSIC_RESERVE.split(/\r?\n/);
        lettersData.forEach((letterData) => {
            const data = letterData.split(',');

            this.tiles.set(data[0], {
                tile: {
                    letter: data[0],
                    points: parseInt(data[2], 10),
                },
                count: parseInt(data[1], 10),
            });

            this.tileCount += parseInt(data[1], 10);
        });
    }

    isLetterExchangePossible(amount: number) {
        if (this.tileCount < MIN_EXCHANGE_RESERVE_COUNT) return false;
        else if (this.tileCount - amount >= 0) return true;
        return false;
    }

    getLetters(amount: number): Tile[] {
        const tiles: Tile[] = [];
        let availableTiles = Array.from(this.tiles.values()).filter((tile) => tile.count > 0);

        for (let i = 0; i < amount; i++) {
            const randomTile: ReserveTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
            tiles.push({ ...randomTile.tile });
            randomTile.count--;
            if (randomTile.count === 0) availableTiles = availableTiles.filter((tile) => tile.count > 0);
        }

        this.tileCount -= amount;
        return tiles;
    }

    returnLetters(tiles: Tile[]) {
        tiles.forEach((tile) => {
            const reserveTile = this.tiles.get(tile.letter);
            if (reserveTile !== undefined) {
                reserveTile.count++;
            }
        });
        this.tileCount += tiles.length;
    }
}

const CLASSIC_RESERVE = `A,9,1
B,2,3
C,2,3
D,3,2
E,15,1
F,2,4
G,2,2
H,2,4
I,8,1
J,1,8
K,1,10
L,5,1
M,3,2
N,6,1
O,6,1
P,2,3
Q,1,8
R,6,1
S,6,1
T,6,1
U,6,1
V,2,4
W,1,10
X,1,10
Y,1,10
Z,1,10
*,2,0`;
