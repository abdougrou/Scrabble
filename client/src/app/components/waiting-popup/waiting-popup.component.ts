import { Component, DoCheck, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dictionary, GameConfig } from '@app/classes/game-config';
import { VirtualPlayerLevelPopupComponent } from '@app/components/virtual-player-level-popup/virtual-player-level-popup.component';
import { RANDOM_PLAYER_NAMES } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LobbyConfig } from '@common/lobby-config';

@Component({
    selector: 'app-waiting-popup',
    templateUrl: './waiting-popup.component.html',
    styleUrls: ['./waiting-popup.component.scss'],
})
export class WaitingPopupComponent implements DoCheck {
    result: { config: LobbyConfig; playerName: string; mainPlayerName: string };
    constructor(
        public dialogRef: MatDialogRef<WaitingPopupComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { config: LobbyConfig },
        public communication: CommunicationService,
        public gameManager: GameManagerService,
        public router: Router,
    ) {}

    ngDoCheck() {
        if (this.communication.started) {
            this.result = {
                config: this.data.config,
                playerName: this.communication.guestName,
                mainPlayerName: this.communication.config.host,
            };
            setTimeout(() => this.dialogRef.close(this.result), 0);
        }
    }
    switchMode() {
        this.openVirtualPlayerLevelPopup()
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.gameManager.initialize(result as GameConfig);
                this.router.navigateByUrl('/game');
                this.communication.leaveLobby();
                this.dialogRef.close(true); // set param true to close all dialogs
            });
    }

    openVirtualPlayerLevelPopup(): MatDialogRef<unknown, unknown> {
        const gameConfig = {
            playerName1: this.data.config.host,
            playerName2: this.pickPlayerName(this.data.config.host),
            gameMode: this.data.config.gameMode,
            isMultiPlayer: false,
            duration: this.data.config.turnDuration,
            bonusEnabled: this.data.config.bonusEnabled,
            dictionary: this.data.config.dictionary === '0' ? Dictionary.French : Dictionary.English,
        };
        return this.dialog.open(VirtualPlayerLevelPopupComponent, {
            height: '220px',
            width: '500px',
            data: { config: gameConfig },
        });
    }

    back() {
        this.communication.leaveLobby();
        this.dialogRef.close();
    }

    startGame() {
        this.router.navigateByUrl('/game');
        this.dialogRef.close();
    }

    pickPlayerName(name: string): string {
        let vPlayerName = RANDOM_PLAYER_NAMES[Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length)];
        while (vPlayerName === name) vPlayerName = RANDOM_PLAYER_NAMES[Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length)];
        return vPlayerName;
    }
}
