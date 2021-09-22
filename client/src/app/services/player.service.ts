import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    players: Player[] = [];
    get current(): Player {
        return this.players[0];
    }

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

    clear() {
        this.players = [];
    }
}
