import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication.service';
import { PlayerName } from '@common/player-name';
import { GameConfigPageComponent } from '../game-config-page/game-config-page.component';

@Component({
    selector: 'app-player-names-popup',
    templateUrl: './player-names-popup.component.html',
    styleUrls: ['./player-names-popup.component.scss'],
})
export class PlayerNamesPopupComponent {
    columnsToDisplay = ['name', 'difficulty'];
    playerNames: PlayerName[] = [];
    constructor(private communication: CommunicationService, public dialogRef: MatDialogRef<GameConfigPageComponent>) {
        this.getPlayerNames();
    }

    getPlayerNames() {
        this.communication.getPlayerNames().subscribe((names) => {
            this.playerNames = names;
        });
    }
    back() {
        this.dialogRef.close();
    }
}
