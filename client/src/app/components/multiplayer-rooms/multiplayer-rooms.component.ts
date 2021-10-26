import { Component } from '@angular/core';
import { WebSocketService } from '@app/services/web-socket.service';
import { GameManagerService } from '@app/services/game-manager.service';

@Component({
    selector: 'app-multiplayer-rooms',
    templateUrl: './multiplayer-rooms.component.html',
    styleUrls: ['./multiplayer-rooms.component.scss'],
})
export class MultiplayerRoomsComponent {
    constructor(public webSocket: WebSocketService, public gameManager: GameManagerService) {}
}
