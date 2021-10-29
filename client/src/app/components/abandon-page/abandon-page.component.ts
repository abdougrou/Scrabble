import { Component } from '@angular/core';
import { GameManagerService } from '@app/services/game-manager.service';

@Component({
    selector: 'app-abandon-page',
    templateUrl: './abandon-page.component.html',
    styleUrls: ['./abandon-page.component.scss'],
})
export class AbandonPageComponent {
    constructor(private gameManager: GameManagerService) {}

    quit() {
        this.gameManager.reset();
    }
}
