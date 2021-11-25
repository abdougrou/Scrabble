import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommunicationService } from '@app/services/communication.service';
import { Difficulty, PlayerName } from '@common/player-name';

@Component({
    selector: 'app-player-names-popup',
    templateUrl: './player-names-popup.component.html',
    styleUrls: ['./player-names-popup.component.scss'],
})
export class PlayerNamesPopupComponent {
    displayedColumns = ['name', 'difficulty', 'edit', 'delete'];
    playerNames: MatTableDataSource<PlayerName>;

    constructor(
        private communication: CommunicationService,
        public dialogRef: MatDialogRef<PlayerNamesPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public playerType: string,
    ) {
        this.getPlayerNames();
    }

    getPlayerNames() {
        if (this.playerType === 'expert') {
            this.communication.getExpertPlayerNames().subscribe((names) => {
                this.playerNames = new MatTableDataSource<PlayerName>(names);
            });
        } else if (this.playerType === 'beginner') {
            this.communication.getBeginnerPlayerNames().subscribe((names) => {
                this.playerNames = new MatTableDataSource<PlayerName>(names);
            });
        }
    }

    back() {
        this.dialogRef.close();
    }

    editPlayerName() {
        window.alert('edit');
    }

    deletePlayerName(element: PlayerName) {
        this.communication.deletePlayerName(element).subscribe((success) => {
            if (success) {
                this.getPlayerNames();
            }
        });
    }
    addPlayer() {
        const playerName: PlayerName = { name: 'newPlayer5', difficulty: Difficulty.Beginner };
        this.communication.addPlayerName(playerName).subscribe((success) => {
            if (success) {
                this.getPlayerNames();
            }
        });
    }
}
