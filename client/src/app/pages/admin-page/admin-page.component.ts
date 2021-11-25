import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlayerNameOptionsComponent } from '@app/components/player-name-options/player-name-options.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    providers: [MatDialog, Overlay],
})
export class AdminPageComponent {
    constructor(public dialog: MatDialog, private communication: CommunicationService) {}

    openNames() {
        this.dialog.open(PlayerNameOptionsComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
        });
    }

    reset() {
        window.alert('reset');
        this.communication.resetPlayerNames().subscribe();
    }
}
