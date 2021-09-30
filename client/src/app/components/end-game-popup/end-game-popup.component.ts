import { Component, Input } from '@angular/core';
import { Player } from '@app/classes/player';

@Component({
    selector: 'app-end-game-popup',
    templateUrl: './end-game-popup.component.html',
    styleUrls: ['./end-game-popup.component.scss'],
})
export class EndGamePopupComponent {
    @Input() players: Player[];
    @Input() winnerName: string;
    @Input() isEqual: boolean;
}
