import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';

@Component({
    selector: 'app-waiting-popup',
    templateUrl: './waiting-popup.component.html',
    styleUrls: ['./waiting-popup.component.scss'],
})
export class WaitingPopupComponent {
    constructor(
        public dialogRef: MatDialogRef<WaitingPopupComponent>,
        public communication: CommunicationService,
        public gameManager: GameManagerService,
        public router: Router,
    ) {}

    switchMode() {
        // delete lobby
    }

    back() {
        // delete lobby
        this.dialogRef.close();
    }

    startGame() {
        this.router.navigateByUrl('/game');
        // delete lobby
        this.dialogRef.close();
    }
}
