/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlayerNamesPopupComponent } from '@app/components/player-names-popup/player-names-popup.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH } from '@app/constants';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    providers: [MatDialog, Overlay],
})
export class AdminPageComponent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(public dialog: MatDialog) {}

    openNames() {
        this.dialog.open(PlayerNamesPopupComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
        });
    }
}
