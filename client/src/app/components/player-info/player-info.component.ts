import { Component, DoCheck } from '@angular/core';
import { Player } from '@app/classes/player';
import { PlayerService } from '@app/services/player.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { MAX_FONT_MULTIPLIER, MIN_FONT_MULTIPLIER } from '@app/constants';
import { GridService } from '@app/services/grid.service';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent implements DoCheck {
    size: number = 0;
    players: Player[] = [];
    mainPlayerName: string;
    isEnded: boolean;

    constructor(private playerService: PlayerService, private gameManager: GameManagerService, private gridService: GridService) {
        this.players = this.playerService.players;
        this.mainPlayerName = this.gameManager.mainPlayerName;
        this.isEnded = this.gameManager.isEnded;
    }
    get timer() {
        return this.gameManager.currentTurnDurationLeft;
    }

    ngDoCheck() {
        if (this.players[0].easel.count === 0 || this.players[1].easel.count === 0) {
            if (this.gameManager.emptyReserve()) this.endGame();
        }
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
        this.gameManager.skipTurn();
    }

    endGame() {
        this.gameManager.endGame();
        this.isEnded = this.gameManager.isEnded;
    }

    quit() {
        this.gameManager.reset();
    }
}
