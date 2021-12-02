import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAX_DESCRIPTION_LENGTH, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@app/constants';
import { DictionaryInfo } from '@common/dictionaryTemplate';

@Component({
    selector: 'app-edit-dictionary-popup',
    templateUrl: './edit-dictionary-popup.component.html',
    styleUrls: ['./edit-dictionary-popup.component.scss'],
})
export class EditDictionaryPopupComponent {
    titleForm: FormGroup;
    descriptionForm: FormGroup;

    message: string;
    constructor(
        public dialogRef: MatDialogRef<EditDictionaryPopupComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public formConfig: DictionaryInfo,
    ) {
        this.titleForm = this.formBuilder.group({
            title: [formConfig.title, [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_USERNAME_LENGTH)]],
        });
        this.descriptionForm = this.formBuilder.group({
            description: [
                formConfig.description,
                [Validators.required, Validators.minLength(MIN_USERNAME_LENGTH), Validators.maxLength(MAX_DESCRIPTION_LENGTH)],
            ],
        });
        this.message = 'Entrer les modifications:';
    }

    confirm() {
        this.dialogRef.close({ title: this.titleForm.get('title')?.value, description: this.descriptionForm.get('description')?.value });
    }
    cancel() {
        this.dialogRef.close('');
    }
}
