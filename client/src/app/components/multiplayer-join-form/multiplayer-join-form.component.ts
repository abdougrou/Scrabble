import { Component, DoCheck, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { LobbyConfig } from '@common/lobby-config';

@Component({
    selector: 'app-multiplayer-join-form',
    templateUrl: './multiplayer-join-form.component.html',
    styleUrls: ['./multiplayer-join-form.component.scss'],
})
export class MultiplayerJoinFormComponent implements DoCheck {
    joinForm: FormGroup;
    result: { config: LobbyConfig; playerName: string; mainPlayerName: string };
    constructor(
        public dialogRef: MatDialogRef<MultiplayerJoinFormComponent>,
        private formBuilder: FormBuilder,
        public communication: CommunicationService,
        @Inject(MAT_DIALOG_DATA) public data: { config: LobbyConfig; message: { key: string; host: string } },
    ) {
        this.joinForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]],
        });
    }

    ngDoCheck() {
        if (this.communication.started) {
            setTimeout(() => this.dialogRef.close(this.result), 0);
        }
    }

    joinLobby() {
        console.log('Host Name In Join Form: ', this.data.message.host);
        const playerName = this.joinForm.get('name')?.value;
        this.result = { config: this.data.config, playerName, mainPlayerName: playerName };
        if (this.data.message.host !== playerName) console.log('Player names are differents!');
        this.communication.joinLobby(this.data.message.key, playerName);
        this.communication.setConfig(this.data.config, playerName);
    }

    back() {
        this.dialogRef.close();
    }
}
