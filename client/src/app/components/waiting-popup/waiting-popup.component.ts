import { Component, DoCheck } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
        public communication: CommunicationService,
        public gameManager: GameManagerService,
        public router: Router,
    ) {}

    ngDoCheck() {
        if (this.communication.started) {
            this.result = {
                config: this.communication.config,
                playerName: this.communication.guestName,
                mainPlayerName: this.communication.config.host,
            };
            console.log(' Client One (config): ', this.result.config);
            console.log(' Client One (guest): ', this.result.playerName);
            setTimeout(() => this.dialogRef.close(this.result), 0);
        }
    }
    switchMode() {
        // nothing
    }

    back() {
        this.dialogRef.close();
        this.communication.leaveLobby();
    }

    startGame() {
        this.router.navigateByUrl('/game');
        this.dialogRef.close();
    }
}
