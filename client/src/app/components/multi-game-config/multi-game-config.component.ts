import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dictionary } from '@app/classes/game-config';
import { WaitingPopupComponent } from '@app/components/waiting-popup/waiting-popup.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH, DURATION_INIT, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LobbyConfig } from '@common/lobby-config';

@Component({
    selector: 'app-multi-game-config',
    templateUrl: './multi-game-config.component.html',
    styleUrls: ['./multi-game-config.component.scss'],
})
export class MultiGameConfigComponent {
    gameConfigForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<MultiGameConfigComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { config: LobbyConfig },
        private formBuilder: FormBuilder,
        public gameManagerService: GameManagerService,
        public router: Router,
        public communication: CommunicationService,
    ) {
        this.gameConfigForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]],
            duration: [DURATION_INIT],
            bonusEnabled: [false],
            dictionary: [Dictionary.French, Validators.required],
        });
    }

    createLobby() {
        this.data.config.host = this.gameConfigForm.get('name')?.value;
        this.data.config.turnDuration = this.gameConfigForm.get('duration')?.value;
        this.data.config.bonusEnabled = this.gameConfigForm.get('bonusEnabled')?.value;
        this.data.config.dictionary = this.gameConfigForm.get('dictionary')?.value;
        this.data.config.key = this.communication.createLobby(this.data.config);
        this.communication.setConfig(this.data.config, 'default');
        this.openWaitingPopup()
            .afterClosed()
            .subscribe((result) => {
                if (!result) return;
                this.dialogRef.close(result);
            });
    }

    openWaitingPopup(): MatDialogRef<unknown, unknown> {
        return this.dialog.open(WaitingPopupComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            disableClose: true,
            data: { config: this.data.config },
        });
    }

    back() {
        this.dialogRef.close();
    }
}
