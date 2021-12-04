import { Component, DoCheck, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameMode } from '@app/classes/game-config';
import { Objective } from '@app/classes/objective';
import { Player } from '@app/classes/player';
import { DURATION_INIT, MAX_FONT_MULTIPLIER, MIN_FONT_MULTIPLIER } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { GridService } from '@app/services/grid.service';
import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';
import { ObjectiveService } from '@app/services/objective.service';
import { PlayerService } from '@app/services/player.service';
import { ReserveService } from '@app/services/reserve.service';
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
    privateObjectives: Objective[] = [];
    publicObjectives: Objective[] = [];
    gameMode: GameMode;

    constructor(
        private playerService: PlayerService,
        private objective: ObjectiveService,
        private gameManager: GameManagerService,
        private multiplayerGameManager: MultiplayerGameManagerService,
        private reserve: ReserveService,
        private router: Router,
        private gridService: GridService,
        private communication: CommunicationService,
        public matDialog: MatDialog,
    ) {
        if (this.router.url === '/multiplayer-game') {
            this.players = this.playerService.players;
            this.mainPlayerName = this.multiplayerGameManager.getMainPlayer().name;
            this.isEnded = false;
            this.gameMode = this.multiplayerGameManager.gameMode;
        } else {
            this.players = this.playerService.players;
            this.mainPlayerName = this.gameManager.gameConfig.playerName1;
            this.isEnded = this.gameManager.isEnded;
            this.gameMode = this.gameManager.gameConfig.gameMode;
        }
        if (this.gameMode === GameMode.LOG2990) {
            this.publicObjectives = this.objective.objectives.filter((obj) => !obj.private && !obj.playerName);
            this.privateObjectives = this.objective.objectives.filter(
                (obj) => (obj.playerName && obj.playerName === this.mainPlayerName) || (obj.private && obj.achieved),
            );
        }

        this.communication.continueSolo().subscribe((message) => {
            if (this.multiplayerGameManager.mainPlayerName === message.mainPlayer.name) {
                this.multiplayerGameManager.reset();
                this.gameManager.initializeFromMultiplayer(this.multiplayerGameManager, message.vPlayer, message.mainPlayer);
                this.players = this.playerService.players;
                this.router.navigateByUrl('/game');
            }
        });
    }

    ngOnDestroy(): void {
        if (this.router.url === '/game') this.quit();
    }
    get timer() {
        let timerValue = 0;
        if (this.router.url === '/multiplayer-game') timerValue = this.multiplayerGameManager.turnDurationLeft;
        else timerValue = this.gameManager.currentTurnDurationLeft;
        const mins = Math.floor(timerValue / DURATION_INIT);
        const secs = timerValue % DURATION_INIT;
        if (timerValue >= DURATION_INIT) return `0${mins}: ${secs}`;
        else if (timerValue >= 10) return `00:${secs}`;
        else return `00:0${secs}`;
    }

    get winner() {
        return this.players[0].score > this.players[1].score ? this.players[0].name : this.players[1].name;
    }

    get reserveCount() {
        if (this.router.url === '/multiplayer-game') return this.multiplayerGameManager.reserve.size;
        else return this.reserve.size;
    }

    ngDoCheck() {
        if (this.players === undefined) return;
        if (this.players[0].easel.count === 0 || this.players[1].easel.count === 0) {
            if (this.router.url !== '/multiplayer-game') {
                if (this.reserve.size === 0) this.endGame();
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
        if (this.router.url === '/game') this.gameManager.reset();
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
