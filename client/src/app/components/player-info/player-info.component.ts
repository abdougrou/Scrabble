import { Component, DoCheck, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Player } from '@app/classes/player';
import { MAX_FONT_MULTIPLIER, MIN_FONT_MULTIPLIER } from '@app/constants';
import { GameManagerService } from '@app/services/game-manager.service';
import { GridService } from '@app/services/grid.service';
import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';
import { PlayerService } from '@app/services/player.service';
// eslint-disable-next-line no-restricted-imports
import { AbandonPageComponent } from '../abandon-page/abandon-page.component';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.scss'],
})
export class PlayerInfoComponent implements DoCheck, OnDestroy {
    fontSize: number = 0;
    players: Player[] = [];
    mainPlayerName: string;
    isEnded: boolean;

    constructor(
        private playerService: PlayerService,
        private gameManager: GameManagerService,
        private multiplayerGameManager: MultiplayerGameManagerService,
        private router: Router,
        private gridService: GridService,
        public matDialog: MatDialog,
    ) {
        if (this.router.url === '/multiplayer-game') {
            this.players = this.multiplayerGameManager.players;
            this.mainPlayerName = this.multiplayerGameManager.getMainPlayer().name;
            this.isEnded = false;
        } else {
            this.players = this.playerService.players;
            this.mainPlayerName = this.gameManager.mainPlayerName;
            this.isEnded = this.gameManager.isEnded;
        }
    }

    ngOnDestroy(): void {
        this.quit();
    }
    get timer() {
        if (this.router.url === '/multiplayer-game') return this.multiplayerGameManager.turnDurationLeft;
        else return this.gameManager.currentTurnDurationLeft;
    }

    get winner() {
        return this.players[0].score > this.players[1].score ? this.players[0].name : this.players[1].name;
    }

    get reserveCount() {
        if (this.router.url === '/multiplayer-game') return this.multiplayerGameManager.reserve.tileCount;
        else return this.gameManager.reserveCount;
    }

    ngDoCheck() {
        if (this.players === undefined) return;
        if (this.players[0].easel.count === 0 || this.players[1].easel.count === 0) {
            if (this.router.url !== '/multiplayer-game') {
                if (this.gameManager.reserveCount === 0) this.endGame();
            }
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
        if (this.router.url === '/multiplayer-game') this.multiplayerGameManager.skipTurn();
        else this.gameManager.buttonSkipTurn();
    }

    endGame() {
        if (this.router.url !== '/multiplayer-game') {
            this.gameManager.endGame();
            this.isEnded = this.gameManager.isEnded;
        }
    }

    quit() {
        if (this.router.url !== '/multiplayer-game') this.gameManager.reset();
    }

    openAbandonPage() {
        const dialogConfig = new MatDialogConfig();
        // The user can't close the dialog by clicking outside its body
        dialogConfig.disableClose = true;
        dialogConfig.id = 'abandon-page-component';
        dialogConfig.height = '200px';
        dialogConfig.width = '550px';
        this.matDialog.open(AbandonPageComponent, dialogConfig);
    }
}
