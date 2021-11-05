import { Component, DoCheck, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { GameConfig } from '@common/lobby-config';

@Component({
    selector: 'app-multiplayer-join-form',
    templateUrl: './multiplayer-join-form.component.html',
    styleUrls: ['./multiplayer-join-form.component.scss'],
})
export class MultiplayerJoinFormComponent implements DoCheck {
    joinForm: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<MultiplayerJoinFormComponent>,
        private formBuilder: FormBuilder,
        public communication: CommunicationService,
        @Inject(MAT_DIALOG_DATA) public data: { config: GameConfig; message: { key: string; host: string } },
    ) {
        this.joinForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]],
        });
    }

    ngDoCheck() {
        if (this.communication.started) this.dialogRef.close(this.communication.config);
    }

    joinLobby() {
        console.log('Host Name In Join Form: ', this.data.message.host);
        const playerName = this.joinForm.get('name')?.value;
        if (this.data.message.host !== playerName) console.log('Player names are differents!');
        this.data.config.playerName2 = playerName;
        this.communication.joinLobby(this.data.message.key, this.data.message.host);
        this.communication.setConfig(this.data.config);
    }

    back() {
        this.dialogRef.close();
    }
}
