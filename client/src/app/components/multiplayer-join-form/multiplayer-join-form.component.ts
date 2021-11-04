import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@app/constants';

@Component({
    selector: 'app-multiplayer-join-form',
    templateUrl: './multiplayer-join-form.component.html',
    styleUrls: ['./multiplayer-join-form.component.scss'],
})
export class MultiplayerJoinFormComponent {
    joinForm: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<MultiplayerJoinFormComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { host: string },
    ) {
        this.joinForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]],
        });
    }

    joinLobby() {
        console.log('Host Name In Join Form: ', this.data.host);
        if (this.data.host !== this.joinForm.get('name')?.value) console.log('Player names are differents!');
        this.dialogRef.close(true);
    }

    back() {
        this.dialogRef.close();
    }
}
