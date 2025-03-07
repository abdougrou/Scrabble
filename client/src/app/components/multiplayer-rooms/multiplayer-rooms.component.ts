import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary, GameMode } from '@app/classes/game-config';
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
    lobbies: LobbyConfig[] = [];

    constructor(
        public dialogRef: MatDialogRef<MultiplayerRoomsComponent>,
        public communication: CommunicationService,
        public gameManager: GameManagerService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { mode: GameMode },
        public snackBar: MatSnackBar,
    ) {
        this.getLobbies();
    }

    async createLobby() {
        this.openFormPopup()
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.dialogRef.close(result);
            });

        const delay = 250;
        await new Promise((resolve) => setTimeout(resolve, delay));

        this.getLobbies();
    }

    openFormPopup(): MatDialogRef<unknown, unknown> {
        const lobbyConfig = {
            host: 'default',
            turnDuration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
            gameMode: this.data.mode,
        };

        return this.dialog.open(MultiGameConfigComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { config: lobbyConfig },
        });
    }

    getLobbies() {
        this.communication.getLobbies().subscribe((lobbies) => {
            this.lobbies = lobbies;
        });
    }

    joinLobby(key: string): void {
        if (!this.lobbies.find((lobby) => lobby.key === key))
            this.snackBar.open("La salle n'est pas disponible, veuillez actualiser la liste des salles.", 'Fermer', {
                duration: 3000,
                panelClass: ['red-snackbar'],
            });

        this.openJoinPopup(key)
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.dialogRef.close(result);
            });
    }

    joinRandomLobby(): void {
        const randomIndex = Math.floor(Math.random() * this.lobbies.length);
        const key = this.lobbies[randomIndex].key;
        this.joinLobby(key as string);
    }

    openJoinPopup(key: string): MatDialogRef<unknown, unknown> {
        const lobbyToJoin = this.lobbies.filter((lobby) => lobby.key === key)[0];
        return this.dialog.open(MultiplayerJoinFormComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { config: lobbyToJoin, message: { key, host: lobbyToJoin.host } },
        });
    }
}
