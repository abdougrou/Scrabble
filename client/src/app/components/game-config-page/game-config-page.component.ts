import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameConfig } from '@app/classes/game-config';
import { DURATION_INIT } from '@app/constants';
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
        dictionary: ['', Validators.required],
    });

    constructor(
        public dialogRef: MatDialogRef<GameConfigPageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { config: GameConfig },
        private formBuilder: FormBuilder,
    ) {}

    // assign input values to the gameConfig instance then close all popups
    play() {
        // eslint-disable-next-line no-console
        console.log('Before : ', this.data.config);
        this.data.config.playerName1 = this.gameConfigForm.get('name')?.value;
        this.data.config.duration = this.gameConfigForm.get('duration')?.value;
        this.data.config.bonusEnabled = this.gameConfigForm.get('bonusEnabled')?.value;
        this.data.config.dictionary = this.gameConfigForm.get('dictionary')?.value;
        // eslint-disable-next-line no-console
        console.log('After : ', this.data.config);
        this.dialogRef.close(true);
    }

    // close just the 2nd popup and clear input data
    back() {
        this.dialogRef.close();
    }
}
