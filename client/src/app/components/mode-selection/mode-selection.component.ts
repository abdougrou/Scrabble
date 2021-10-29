import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dictionary, GameConfig, GameMode } from '@app/classes/game-config';
import { GameConfigPageComponent } from '@app/components/game-config-page/game-config-page.component';
import { MultiplayerRoomsComponent } from '@app/components/multiplayer-rooms/multiplayer-rooms.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH, DURATION_INIT } from '@app/constants';
import { GameManagerService } from '@app/services/game-manager.service';

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
        // private communication: CommunicationService,
        @Inject(MAT_DIALOG_DATA) public data: { mode: GameMode },
        private gameManager: GameManagerService,
        private router: Router,
    ) {}

    playSolo(): void {
        this.openDialogBox(false)
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.gameManager.initialize(result as GameConfig);
                this.router.navigateByUrl('/game');
                this.closeSelf();
            });
    }

    playMulti(): void {
        this.openDialogBox(true)
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.gameManager.initialize(result as GameConfig);
                this.router.navigateByUrl('/game');
                this.closeSelf();
            });
    }

    closeSelf(): void {
        this.dialogRef.close();
    }

    // Open game configuration popup
    private openDialogBox(isMulti: boolean): MatDialogRef<unknown, unknown> {
        const gameConfig = {
            playerName1: 'default',
            playerName2: 'default',
            gameMode: this.data.mode,
            isMultiPlayer: false,
            duration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
        } as GameConfig;

        if (isMulti) {
            return this.dialog.open(MultiplayerRoomsComponent, {
                height: DIALOG_HEIGHT,
                width: DIALOG_WIDTH,
                data: { config: gameConfig },
            });
        } else {
            return this.dialog.open(GameConfigPageComponent, {
                height: DIALOG_HEIGHT,
                width: DIALOG_WIDTH,
                data: { config: gameConfig },
            });
        }
    }
}
