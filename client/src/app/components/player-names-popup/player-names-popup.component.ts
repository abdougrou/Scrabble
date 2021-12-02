import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormConfig, FormType } from '@app/classes/form-config';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { PlayerNameFormComponent } from '@app/components/player-name-form/player-name-form.component';
import { CommunicationService } from '@app/services/communication.service';
import { DEFAULT_VIRTUAL_PLAYER_NAMES } from '@common/constants';
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
        public communication: CommunicationService,
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
        this.dialog
            .open(PlayerNameFormComponent, {
                disableClose: true,
                height: '220px',
                width: '550px',
                data: formConfig,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result !== '') {
                    this.communication
                        .modifyPlayerName(element, {
                            name: result,
                            difficulty: this.playerType === 'expert' ? Difficulty.Expert : Difficulty.Beginner,
                        })
                        .subscribe((response) => {
                            if (response) {
                                this.getPlayerNames();
                            }
                        });
                }
            });
    }

    deletePlayerName(element: PlayerName) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'abandon-page-component';
        dialogConfig.height = '200px';
        dialogConfig.width = '550px';
        dialogConfig.data = `Le joueur ${element.name} sera supprimé`;
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.communication.deletePlayerName(element).subscribe((success) => {
                    if (success) {
                        this.getPlayerNames();
                    }
                });
            }
        });
    }

    addPlayer() {
        const formConfig: FormConfig = { formType: FormType.AddForm, data: '' };
        this.dialog
            .open(PlayerNameFormComponent, {
                disableClose: true,
                height: '220px',
                width: '550px',
                data: formConfig,
            })
            .afterClosed()
            .subscribe((result) => {
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

    isDefault(element: PlayerName): boolean {
        for (const playerName of DEFAULT_VIRTUAL_PLAYER_NAMES) {
            if (element.name === playerName.name) {
                return true;
            }
        }
        return false;
    }
}
