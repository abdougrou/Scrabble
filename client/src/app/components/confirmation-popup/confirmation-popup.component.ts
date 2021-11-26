import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-popup',
    templateUrl: './confirmation-popup.component.html',
    styleUrls: ['./confirmation-popup.component.scss'],
})
export class ConfirmationPopupComponent {
    message: string;
    constructor(public dialogRef: MatDialogRef<ConfirmationPopupComponent>, @Inject(MAT_DIALOG_DATA) public popupType: string) {
        this.message =
            popupType === 'delete'
                ? 'Etes vous sure de vouloir supprimer ce nom de joueur'
                : 'Etes vous sure de vouloir reinitialiser la base de donnee';
    }

    quit(confirmation: boolean) {
        this.dialogRef.close(confirmation);
    }
}
