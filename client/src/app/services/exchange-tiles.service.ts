import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeTilesService {
    constructor(private reserve: ReserveService, private players: PlayerService) {}

    exchangeTiles(tiles: string, player: Player): string {
        let message = '';
        if (this.players.current !== player) {
            message = "Ce n'est pas votre tour";
        } else if (!this.reserve.isExchangePossible(tiles.length)) {
            message = "Il n'y a pas assez de tuiles dans la réserve";
        } else if (!player.easel.containsTiles(tiles)) {
            message = 'Votre chevalet ne contient pas les lettres nécessaires';
        } else {
            const easelTiles: Tile[] = player.easel.getTiles(tiles); // getTiles remove and get the tiles
            const reserveTiles: Tile[] = this.reserve.getLetters(tiles.length);
            player.easel.addTiles(reserveTiles);
            this.reserve.returnLetters(easelTiles);
            message = '';
        }
        return message;
    }
}
