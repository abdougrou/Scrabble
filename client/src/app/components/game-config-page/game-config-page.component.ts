import { Component, DoCheck, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionary, GameConfig } from '@app/classes/game-config';
import { DURATION_INIT, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, RANDOM_PLAYER_NAMES } from '@app/constants';
import { GameManagerService } from '@app/services/game-manager.service';

@Component({
    selector: 'app-game-config-page',
    templateUrl: './game-config-page.component.html',
    styleUrls: ['./game-config-page.component.scss'],
    providers: [],
})
export class GameConfigPageComponent implements DoCheck {
    // Form Builder Group to collect data from inputs then assign it to gameConfig instance using ngModel in the template
    gameConfigForm: FormGroup;
    dictionary: string;

    randomPlayerNameIndex: number;
    randomPlayerName: string;

    constructor(
        public dialogRef: MatDialogRef<GameConfigPageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { config: GameConfig },
        private formBuilder: FormBuilder,
        public gameManagerService: GameManagerService,
    ) {
        this.randomPlayerNameIndex = Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length);
        this.randomPlayerName = RANDOM_PLAYER_NAMES[this.randomPlayerNameIndex];

        this.gameConfigForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]],
            duration: [DURATION_INIT],
            bonusEnabled: [false],
            dictionary: [Dictionary.French, Validators.required],
            expert: [false],
        });
        this.dictionary = 'Francais';
    }

    ngDoCheck() {
        if (this.gameConfigForm.get('name')?.value === this.randomPlayerName) {
            this.pickPlayerName();
        }
    }

    // assign input values to the gameConfig instance then close all popups
    play() {
        this.pickPlayerName();
        this.data.config.playerName1 = this.gameConfigForm.get('name')?.value;
        this.data.config.playerName2 = this.randomPlayerName;
        this.data.config.duration = this.gameConfigForm.get('duration')?.value;
        this.data.config.bonusEnabled = this.gameConfigForm.get('bonusEnabled')?.value;
        this.data.config.dictionary = this.gameConfigForm.get('dictionary')?.value;
        this.data.config.expert = Boolean(this.gameConfigForm.get('expert')?.value);
        this.dialogRef.close(this.data.config);
    }

    // close just the 2nd popup and clear input data
    back() {
        this.dialogRef.close();
    }

    pickPlayerName() {
        while (this.randomPlayerName === this.gameConfigForm.get('name')?.value)
            this.randomPlayerName = RANDOM_PLAYER_NAMES[Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length)];
    }
}
