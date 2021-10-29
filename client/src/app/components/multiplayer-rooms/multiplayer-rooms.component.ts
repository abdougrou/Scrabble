import { Component } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { Lobby } from '@common/lobby';

@Component({
    selector: 'app-multiplayer-rooms',
    templateUrl: './multiplayer-rooms.component.html',
    styleUrls: ['./multiplayer-rooms.component.scss'],
})
export class MultiplayerRoomsComponent {
    lobbies: Lobby[];

    constructor(public communication: CommunicationService, public gameManager: GameManagerService) {
        this.getLobbies();
    }

    async createLobby() {
        const duration = 60;
        this.communication.createLobby('testHostName', duration);

        const delay = 250;
        await new Promise((resolve) => setTimeout(resolve, delay));

        this.getLobbies();
    }

    getLobbies() {
        this.communication.getLobbies().subscribe((lobbies) => {
            this.lobbies = lobbies;
        });
    }
}
