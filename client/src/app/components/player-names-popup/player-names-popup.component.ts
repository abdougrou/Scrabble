import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormConfig, FormType } from '@app/classes/form-config';
import { PlayerNameFormComponent } from '@app/components/player-name-form/player-name-form.component';
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
        public dialog: MatDialog,
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

    editPlayerName(element: PlayerName) {
        const formConfig: FormConfig = { formType: FormType.EditForm, data: element.name };
        const dialogRef = this.dialog.open(PlayerNameFormComponent, {
            disableClose: true,
            height: '220px',
            width: '550px',
            data: formConfig,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== '') {
                this.communication
                    .modifyPlayerName(element, { name: result, difficulty: this.playerType === 'expert' ? Difficulty.Expert : Difficulty.Beginner })
                    .subscribe((response) => {
                        if (response) {
                            this.getPlayerNames();
                        }
                    });
            }
        });
    }

    deletePlayerName(element: PlayerName) {
        this.communication.deletePlayerName(element).subscribe((success) => {
            if (success) {
                this.getPlayerNames();
            }
        });
    }

    addPlayer() {
        const formConfig: FormConfig = { formType: FormType.AddForm, data: '' };
        const dialogRef = this.dialog.open(PlayerNameFormComponent, {
            disableClose: true,
            height: '220px',
            width: '550px',
            data: formConfig,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== '') {
                this.communication
                    .addPlayerName({ name: result, difficulty: this.playerType === 'expert' ? Difficulty.Expert : Difficulty.Beginner })
                    .subscribe((response) => {
                        if (response) {
                            this.getPlayerNames();
                        }
                    });
            }
        });
    }
}
