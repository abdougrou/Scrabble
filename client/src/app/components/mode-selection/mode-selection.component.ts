import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionary, GameConfig, GameMode } from '@app/classes/game-config';
import { DIALOG_HEIGHT, DIALOG_WIDTH, DURATION_INIT } from '@app/constants';
// eslint-disable-next-line no-restricted-imports
import { GameConfigPageComponent } from '../game-config-page/game-config-page.component';

@Component({
    selector: 'app-mode-selection',
    templateUrl: './mode-selection.component.html',
    styleUrls: ['./mode-selection.component.scss'],
    providers: [],
})
export class ModeSelectionComponent {
    constructor(
        public dialogRef: MatDialogRef<ModeSelectionComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { mode: GameMode },
    ) {}

    // Open game configuration popup
    playSolo(): void {
        const gameConfig = {
            playerName1: 'default',
            playerName2: 'default',
            gameMode: this.data.mode,
            isMultiPlayer: false,
            duration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
        } as GameConfig;

        const dialogRef = this.dialog.open(GameConfigPageComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { config: gameConfig },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.dialogRef.close();
            }
        });
    }

    // close the 1st popup
    back() {
        this.dialogRef.close();
    }
}
