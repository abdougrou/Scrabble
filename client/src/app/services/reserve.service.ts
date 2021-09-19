import { Injectable } from '@angular/core';
import { ReserveTile, Tile } from '@app/classes/tile';
import { CLASSIC_RESERVE, MIN_EXCHANGE_RESERVE_COUNT } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
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

    isExchangePossible(amount: number) {
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
