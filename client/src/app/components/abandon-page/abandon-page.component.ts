import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameManagerService } from '@app/services/game-manager.service';

@Component({
    selector: 'app-abandon-page',
    templateUrl: './abandon-page.component.html',
    styleUrls: ['./abandon-page.component.scss'],
})
export class AbandonPageComponent {
    constructor(private gameManager: GameManagerService, private router: Router) {}

    quit() {
        this.router.navigateByUrl('./home');
        this.gameManager.reset();
    }
}
