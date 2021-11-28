import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameManagerService } from '@app/services/game-manager.service';
import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';

@Component({
    selector: 'app-abandon-page',
    templateUrl: './abandon-page.component.html',
    styleUrls: ['./abandon-page.component.scss'],
})
export class AbandonPageComponent {
    constructor(private gameManager: GameManagerService, private router: Router, private multiplayerGameManager: MultiplayerGameManagerService) {}

    quit() {
        this.router.navigateByUrl('./home');
        this.gameManager.reset();
        if (this.router.url === './multiplayer-game') {
            this.multiplayerGameManager.communication.leaveLobby();
        }
    }
}
