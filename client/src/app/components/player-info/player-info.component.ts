import { Component, DoCheck } from '@angular/core';
import { Player } from '@app/classes/player';
import { MAX_FONT_MULTIPLIER, MIN_FONT_MULTIPLIER } from '@app/constants';
import { GameManagerService } from '@app/services/game-manager.service';
import { GridService } from '@app/services/grid.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent implements DoCheck {
    fontSize: number = 0;
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

    get winner() {
        return this.players[0].score > this.players[1].score ? this.players[0].name : this.players[1].name;
    }

    get reserveCount() {
        return this.gameManager.reserveCount;
    }

    ngDoCheck() {
        if (this.players === undefined) return;
        if (this.players[0].easel.count === 0 || this.players[1].easel.count === 0) {
            if (this.gameManager.reserveCount === 0) this.endGame();
        }
    }

    // TODO implement code for font size manipulation
    increaseFont() {
        if (this.fontSize < MAX_FONT_MULTIPLIER) {
            this.fontSize++;
            this.gridService.clearBoard();
            this.gridService.drawBoard(this.fontSize);
        }
    }

    decreaseFont() {
        if (this.fontSize > MIN_FONT_MULTIPLIER) {
            this.fontSize--;
            this.gridService.clearBoard();
            this.gridService.drawBoard(this.fontSize);
        }
    }

    skipTurn() {
        this.gameManager.buttonSkipTurn();
    }

    endGame() {
        this.gameManager.endGame();
        this.isEnded = this.gameManager.isEnded;
    }

    quit() {
        this.gameManager.reset();
    }
}
