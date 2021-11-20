import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
// import { Tile } from '@app/classes/tile';
import { SYSTEM_NAME } from '@app/constants';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeTilesService {
    constructor(private reserve: ReserveService, private players: PlayerService) {}

    exchangeTiles(tiles: string, player: Player): ChatMessage {
        const message: ChatMessage = { user: SYSTEM_NAME, body: '' };

        if (this.players.current !== player) {
            message.body = "Ce n'est pas votre tour";
        } else if (!this.reserve.isExchangePossible(tiles.length)) {
            message.body = "Il n'y a pas assez de tuiles dans la réserve";
        } else if (!player.easel.contains(tiles.split(''))) {
            message.body = 'Votre chevalet ne contient pas les lettres nécessaires';
        } else {
            const easelTiles: string[] = player.easel.getLetters(tiles.split('')); // getTiles remove and get the tiles
            // const reserveTiles: Tile[] = this.reserve.getLetters(tiles.length);
            // player.easel.addTiles(reserveTiles);
            this.reserve.returnLetters(easelTiles);
            message.body = '';
        }
        return message;
    }
}
