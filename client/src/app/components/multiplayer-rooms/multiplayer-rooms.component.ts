import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionary, GameConfig, GameMode } from '@app/classes/game-config';
import { MultiGameConfigComponent } from '@app/components/multi-game-config/multi-game-config.component';
import { MultiplayerJoinFormComponent } from '@app/components/multiplayer-join-form/multiplayer-join-form.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH, DURATION_INIT } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LobbyConfig } from '@common/lobby-config';

@Component({
    selector: 'app-multiplayer-rooms',
    templateUrl: './multiplayer-rooms.component.html',
    styleUrls: ['./multiplayer-rooms.component.scss'],
})
export class MultiplayerRoomsComponent {
    lobbies: LobbyConfig[];

    constructor(
        public dialogRef: MatDialogRef<MultiplayerRoomsComponent>,
        public communication: CommunicationService,
        public gameManager: GameManagerService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { mode: GameMode },
    ) {
        this.getLobbies();
    }

    async createLobby() {
        this.openFormPopup()
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.gameManager.initialize(result as GameConfig);
                this.closeSelf();
            });

        const delay = 250;
        await new Promise((resolve) => setTimeout(resolve, delay));

        this.getLobbies();
    }

    openFormPopup(): MatDialogRef<unknown, unknown> {
        const gameConfig = {
            playerName1: 'default',
            playerName2: 'default',
            gameMode: this.data.mode,
            isMultiPlayer: true,
            duration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
        } as GameConfig;

        return this.dialog.open(MultiGameConfigComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { config: gameConfig },
        });
    }

    getLobbies() {
        this.communication.getLobbies().subscribe((lobbies) => {
            this.lobbies = lobbies;
        });
    }

    closeSelf(): void {
        this.dialogRef.close();
    }

    joinLobby(key: string): void {
        this.openJoinPopup(key)
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                // serverGameManager initialize game
                // delete lobby
                this.communication.joinLobby(key);
                this.closeSelf();
            });
    }

    openJoinPopup(key: string): MatDialogRef<unknown, unknown> {
        const lobbyToJoin = this.lobbies.filter((lobby) => lobby.key === key)[0];
        return this.dialog.open(MultiplayerJoinFormComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { host: lobbyToJoin.host },
        });
    }
}
