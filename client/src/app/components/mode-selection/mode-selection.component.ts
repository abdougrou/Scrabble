import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameConfig } from '@app/classes/game-config';
import { DIALOG_HEIGHT, DIALOG_WIDTH } from '@app/pages/main-page/main-page.component';
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
        @Inject(MAT_DIALOG_DATA) public data: { gameConfig: GameConfig },
    ) {}

    // Open game configuration popup
    playSolo(): void {
        const dialogRef = this.dialog.open(GameConfigPageComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { gameConfig: this.data.gameConfig },
        });

        // eslint-disable-next-line no-console
        console.log(this.data.gameConfig);

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.dialogRef.close();
            }
            // eslint-disable-next-line no-console
            console.log(`Game Initialized: ${result}`);
        });
    }

    // close the 1st popup
    back() {
        this.dialogRef.close();
    }
}
