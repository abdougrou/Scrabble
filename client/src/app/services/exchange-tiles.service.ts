import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { SYSTEM_NAME } from '@app/constants';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeTilesService {
    constructor(public reserve: ReserveService, private players: PlayerService) {}

    exchangeLetters(letters: string[], player: Player): ChatMessage {
        const message: ChatMessage = { user: SYSTEM_NAME, body: '' };

        if (this.players.current !== player) {
            message.body = "Ce n'est pas votre tour";
        } else if (!this.reserve.isExchangePossible(letters.length)) {
            message.body = "Il n'y a pas assez de tuiles dans la réserve";
        } else if (!player.easel.contains(letters)) {
            message.body = 'Votre chevalet ne contient pas les lettres nécessaires';
        } else {
            const easelLetters: string[] = player.easel.getLetters(letters);
            const reserveLetters: string[] = this.reserve.getRandomLetters(letters.length);
            player.easel.addLetters(reserveLetters);
            this.reserve.returnLetters(easelLetters);
            message.body = '';
        }
        return message;
    }
}
