import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlayerNamesPopupComponent } from '@app/components/player-names-popup/player-names-popup.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH } from '@app/constants';

@Component({
    selector: 'app-player-name-options',
    templateUrl: './player-name-options.component.html',
    styleUrls: ['./player-name-options.component.scss'],
})
export class PlayerNameOptionsComponent {
    constructor(public dialogRef: MatDialogRef<PlayerNameOptionsComponent>, public dialog: MatDialog) {}

    openBeginner(): void {
        this.dialog.open(PlayerNamesPopupComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: 'beginner',
        });
    }

    openExpert(): void {
        this.dialog.open(PlayerNamesPopupComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: 'expert',
        });
    }

    closeSelf(): void {
        this.dialogRef.close();
    }
}
