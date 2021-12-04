import { Component, DoCheck, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary, GameConfig } from '@app/classes/game-config';
import { DURATION_INIT, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, RANDOM_PLAYER_NAMES } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { DictionaryInfo } from '@common/dictionaryTemplate';

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
    dictionaries: DictionaryInfo[];
    randomPlayerNameIndex: number;
    randomPlayerName: string;
    dictionaryValid: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<GameConfigPageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { config: GameConfig },
        private formBuilder: FormBuilder,
        public gameManagerService: GameManagerService,
        public communication: CommunicationService,
        private snackBar: MatSnackBar,
    ) {
        this.randomPlayerNameIndex = Math.floor(Math.random() * RANDOM_PLAYER_NAMES.length);
        this.randomPlayerName = RANDOM_PLAYER_NAMES[this.randomPlayerNameIndex];

        this.communication.getDictionaryInfo().subscribe((dict) => {
            this.dictionaries = dict;
        });

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

    checkDictionaries(dictionary: DictionaryInfo | string) {
        if (dictionary === Dictionary.French.toString()) {
            this.dictionaryValid = true;
            return;
        }
        if (dictionary as DictionaryInfo) {
            this.communication.getDictionaryInfo().subscribe((dictionaries) => {
                const found = dictionaries.find((element) => element.title === (dictionary as DictionaryInfo).title);
                if (!found) {
                    this.snackBar.open("Le dictionnaire n'existe plus dans la liste des dictionnaire", 'Fermer', {
                        duration: 3000,
                        panelClass: ['red-snackbar'],
                    });
                    this.dictionaryValid = false;
                    return;
                }
                this.dictionaryValid = true;
            });
        }
    }
}
