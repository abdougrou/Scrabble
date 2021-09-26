import { Component } from '@angular/core';
import { Player } from '@app/classes/player';
import { PlayerService } from '@app/services/player.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { MAX_FONT_MULTIPLIER, MAX_SKIP_COUNT, MIN_FONT_MULTIPLIER } from '@app/constants';
import { GridService } from '@app/services/grid.service';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent {
    size: number = 0;
    players: Player[] = [];

    constructor(private playerService: PlayerService, private gameManager: GameManagerService, private gridService: GridService) {
        this.players = this.playerService.players;
    }
    get timer() {
        return this.gameManager.currentTurnDurationLeft;
    }

    // TODO implement code for font size manipulation
    increaseFont() {
        if (this.size < MAX_FONT_MULTIPLIER) {
            this.size++;
            this.gridService.clearBoard();
            this.gridService.drawBoard(this.size);
        }
    }

    decreaseFont() {
        if (this.size > MIN_FONT_MULTIPLIER) {
            this.size--;
            this.gridService.clearBoard();
            this.gridService.drawBoard(this.size);
        }
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
}
