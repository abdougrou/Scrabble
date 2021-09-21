import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DURATION_INIT, GameConfig } from '@app/classes/game-config';

export const MAX_USERNAME_LENGTH = 20;
export const MIN_USERNAME_LENGTH = 2;

@Component({
    selector: 'app-game-config-page',
    templateUrl: './game-config-page.component.html',
    styleUrls: ['./game-config-page.component.scss'],
    providers: [],
})
export class GameConfigPageComponent {
    // Form Builder Group to collect data from inputs then assign it to gameConfig instance using ngModel in the template
    // eslint-disable-next-line no-invalid-this
    gameConfigForm = this.formBuilder.group({
        name: ['', Validators.required],
        duration: [DURATION_INIT],
        bonusEnabled: [false],
        dictionnary: ['', Validators.required],
    });

    get name() {
        return this.gameConfigForm.get('name');
    }
    get duration() {
        return this.gameConfigForm.get('duration');
    }
    get bonusEnabled() {
        return this.gameConfigForm.get('bonusEnabled');
    }
    get dictionnary() {
        return this.gameConfigForm.get('dictionnary');
    }

    constructor(
        public dialogRef: MatDialogRef<GameConfigPageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { gameConfig: GameConfig },
        private formBuilder: FormBuilder,
    ) {}

    // assign input values to the gameConfig instance then close all popups
    play() {
        this.data.gameConfig.name = this.gameConfigForm.get('name')?.value;
        this.data.gameConfig.duration = this.gameConfigForm.get('duration')?.value;
        this.data.gameConfig.bonusEnabled = this.gameConfigForm.get('bonusEnabled')?.value;
        this.data.gameConfig.dictionnary = this.gameConfigForm.get('dictionnary')?.value;
        this.dialogRef.close(true);
    }

    // close just the 2nd popup and clear input data
    back() {
        this.data.gameConfig.clear();
        this.dialogRef.close();
    }
}
