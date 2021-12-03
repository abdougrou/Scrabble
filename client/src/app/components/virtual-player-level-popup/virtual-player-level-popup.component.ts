import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameConfig } from '@app/classes/game-config';
import { WaitingPopupComponent } from '@app/components/waiting-popup/waiting-popup.component';

@Component({
    selector: 'app-virtual-player-level-popup',
    templateUrl: './virtual-player-level-popup.component.html',
    styleUrls: ['./virtual-player-level-popup.component.scss'],
})
export class VirtualPlayerLevelPopupComponent {
    constructor(public dialogRef: MatDialogRef<WaitingPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: { config: GameConfig }) {}

    beginner() {
        this.data.config.expert = false;
        this.dialogRef.close(this.data.config);
    }

    expert() {
        this.data.config.expert = true;
        this.dialogRef.close(this.data.config);
    }
}
