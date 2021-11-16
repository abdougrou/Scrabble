import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameMode } from '@app/classes/game-config';
import { ModeSelectionComponent } from '@app/components/mode-selection/mode-selection.component';
import { RankingPopupComponent } from '@app/components/ranking-popup/ranking-popup.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    providers: [MatDialog, Overlay],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(public dialog: MatDialog, public coommunication: CommunicationService) {}

    // Press Classic Button
    startClassic() {
        this.start(GameMode.Classic);
    }

    // Press LOG2990 Button
    startLOG() {
        this.start(GameMode.LOG2990);
    }

    openRanks() {
        this.dialog.open(RankingPopupComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
        });
    }

    // Set the game mode then open the first popup
    start(gameMode: GameMode) {
        this.dialog.open(ModeSelectionComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { mode: gameMode },
        });
    }
}
