import { AfterViewInit, Component } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent implements AfterViewInit {
    tiles: Tile[] = [];

    constructor(private playerService: PlayerService) {}

    ngAfterViewInit() {
        this.tiles = this.playerService.current.easel.tiles;
    }
}
