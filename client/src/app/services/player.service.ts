import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    players: Player[] = [];
    skipCounter = 0;
    get current(): Player {
        return this.players[0];
    }
    mainPlayer: Player;

    createPlayer(name: string, tiles: Tile[]) {
        const player: Player = {
            name,
            easel: new Easel(tiles),
            score: 0,
        };
        this.players.push(player);
    }

    switchPlayers() {
        this.players.reverse();
    }

    getPlayerByName(name: string): Player {
        if (this.players[1].name === name) return this.players[1];
        else return this.players[0];
    }

    incrementSkipCounter() {
        this.skipCounter++;
    }

    clear() {
        this.players = [];
    }
}
