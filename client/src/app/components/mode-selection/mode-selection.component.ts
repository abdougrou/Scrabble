import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dictionary, GameConfig, GameMode } from '@app/classes/game-config';
import { DIALOG_HEIGHT, DIALOG_WIDTH, DURATION_INIT } from '@app/constants';
import { GameConfigPageComponent } from '@app/components/game-config-page/game-config-page.component';
import { WebSocketService } from '@app/services/web-socket.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { Router } from '@angular/router';

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
        private webSocket: WebSocketService,
        @Inject(MAT_DIALOG_DATA) public data: { mode: GameMode },
        private gameManager: GameManagerService,
        private router: Router,
    ) {}

    playSolo(): void {
        this.openDialogBox()
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.gameManager.initialize(result as GameConfig);
                this.router.navigateByUrl('/game');
                this.closeSelf();
            });
    }

    playMulti(): void {
        this.openDialogBox()
            .afterClosed()
            .subscribe((result) => {
                if (!result || !this.webSocket.startMultiplayerGame((result as GameConfig).playerName1)) return;
                const gameConfig = result as GameConfig;
                gameConfig.isMultiPlayer = true;
                this.gameManager.initialize(gameConfig);
                this.router.navigateByUrl('/game');
                this.closeSelf();
            });
    }

    closeSelf(): void {
        this.dialogRef.close();
    }

    // Open game configuration popup
    private openDialogBox(): MatDialogRef<GameConfigPageComponent, unknown> {
        const gameConfig = {
            playerName1: 'default',
            playerName2: 'default',
            gameMode: this.data.mode,
            isMultiPlayer: false,
            duration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
        } as GameConfig;

        return this.dialog.open(GameConfigPageComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { config: gameConfig },
        });
    }
}
