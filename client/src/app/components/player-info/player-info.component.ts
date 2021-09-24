import { Component } from '@angular/core';
import { Player } from '@app/classes/player';
import { PlayerService } from '@app/services/player.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { MAX_SKIP_COUNT } from '@app/constants';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent {
    players: Player[] = [];
    constructor(private playerService: PlayerService, private gameManager: GameManagerService) {
        this.players = this.playerService.players;
    }
    get timer() {
        return this.gameManager.currentTurnDurationLeft;
    }

    skipTurn() {
        if (this.playerService.skipCounter === MAX_SKIP_COUNT - 1) {
            // TODO replace this block of code
            // eslint-disable-next-line no-console
            console.log('Game Normally Ended');
        }
        this.gameManager.skipTurn();
    }

    quit() {
        this.gameManager.reset();
    }

    // TODO implement code for font size manipulation
}
