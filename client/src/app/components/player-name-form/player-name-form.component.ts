import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormConfig, FormType } from '@app/classes/form-config';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@app/constants';

@Component({
    selector: 'app-player-name-form',
    templateUrl: './player-name-form.component.html',
    styleUrls: ['./player-name-form.component.scss'],
})
export class PlayerNameFormComponent {
    playerNameForm: FormGroup;
    message: string;
    constructor(
        public dialogRef: MatDialogRef<PlayerNameFormComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public formConfig: FormConfig,
    ) {
        this.playerNameForm = this.formBuilder.group({
            name: [formConfig.data, [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]],
        });
        this.getMessage(formConfig.formType);
    }

    getMessage(formType: FormType) {
        this.message = formType === FormType.AddForm ? 'Entrer le nom du joueur à ajouter:' : 'Entrer les modifications:';
    }

    confirm() {
        this.dialogRef.close((this.playerNameForm.get('name') as AbstractControl).value);
    }
    cancel() {
        this.dialogRef.close('');
    }
}
