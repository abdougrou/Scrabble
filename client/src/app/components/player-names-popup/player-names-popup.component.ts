import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormConfig, FormType } from '@app/classes/form-config';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { PlayerNameFormComponent } from '@app/components/player-name-form/player-name-form.component';
import { PLAYER_ADD_MESSAGE, PLAYER_DELETE_MESSAGE, PLAYER_MODIFY_MESSAGE, SNACKBAR_CONFIG } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { DEFAULT_VIRTUAL_PLAYER_NAMES } from '@common/constants';
import { Difficulty, PlayerName } from '@common/player-name';

@Component({
    selector: 'app-player-names-popup',
    templateUrl: './player-names-popup.component.html',
    styleUrls: ['./player-names-popup.component.scss'],
})
export class PlayerNamesPopupComponent implements AfterViewInit {
    displayedColumns = ['name', 'difficulty', 'edit', 'delete'];
    playerNames: MatTableDataSource<PlayerName>;
    constructor(
        public communication: CommunicationService,
        public dialogRef: MatDialogRef<PlayerNamesPopupComponent>,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public playerDifficulty: Difficulty,
    ) {}

    ngAfterViewInit() {
        this.getPlayerNames();
    }

    getPlayerNames() {
        if (this.playerDifficulty === Difficulty.Expert) {
            this.communication.getExpertPlayerNames().subscribe((names) => {
                this.playerNames = new MatTableDataSource<PlayerName>(names);
            });
        } else {
            this.communication.getBeginnerPlayerNames().subscribe((names) => {
                this.playerNames = new MatTableDataSource<PlayerName>(names);
            });
        }
    }

    addPlayer() {
        const formConfig: FormConfig = { formType: FormType.AddForm, data: '' };
        this.openForm(formConfig).then((result) => {
            if (result !== '') {
                this.communication.addPlayerName({ name: result, difficulty: this.playerDifficulty }).subscribe((success) => {
                    this.manageRequestResponses(success, PLAYER_ADD_MESSAGE);
                });
            }
        });
    }

    editPlayerName(element: PlayerName) {
        const formConfig: FormConfig = { formType: FormType.EditForm, data: element.name };
        this.openForm(formConfig).then((response) => {
            if (response !== '') {
                this.communication
                    .modifyPlayerName(element, {
                        name: response,
                        difficulty: this.playerDifficulty,
                    })
                    .subscribe((success) => {
                        this.manageRequestResponses(success, PLAYER_MODIFY_MESSAGE);
                    });
            }
        });
    }

    deletePlayerName(element: PlayerName) {
        this.dialog
            .open(ConfirmationPopupComponent, {
                disableClose: true,
                height: '200px',
                width: '550px',
                data: `Le joueur ${element.name} sera supprimé`,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.communication.deletePlayerName(element).subscribe((success) => {
                        this.manageRequestResponses(success, PLAYER_DELETE_MESSAGE);
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

    async openForm(formConfig: FormConfig): Promise<string> {
        return this.dialog
            .open(PlayerNameFormComponent, {
                disableClose: true,
                height: '220px',
                width: '550px',
                data: formConfig,
            })
            .afterClosed()
            .toPromise();
    }

    back() {
        this.dialogRef.close();
    }

    manageRequestResponses(response: boolean, message: string) {
        if (response) this.getPlayerNames();
        else {
            this.snackBar.open(message, 'Fermer', SNACKBAR_CONFIG);
        }
    }
}
