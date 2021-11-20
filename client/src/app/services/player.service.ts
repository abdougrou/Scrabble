import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
// import { VirtualPlayer } from '@app/classes/virtual-player';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    players: Player[] = [];
    skipCounter = 0;
    endTurn: BehaviorSubject<string> = new BehaviorSubject('');
    get current(): Player {
        return this.players[0];
    }
    mainPlayer: Player;

    createPlayer(name: string, letters: string[]) {
        const player: Player = {
            name,
            easel: new Easel(letters),
            score: 0,
        };
        this.players.push(player);
    }

    createVirtualPlayer(name: string, letters: string[]) {
        // TODO change to virtual player
        const player: Player = {
            name,
            easel: new Easel(letters),
            score: 0,
        };
        this.players.push(player);
    }

    switchPlayers() {
        this.players.reverse();
        this.endTurn.next('a');
    }

    getPlayerByName(name: string): Player {
        if (this.players[1].name === name) return this.players[1];
        else return this.players[0];
    }

    clear() {
        this.players = [];
    }
}
