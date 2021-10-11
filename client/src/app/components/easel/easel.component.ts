import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EaselTile, TileState } from '@app/classes/tile';
import { KEYBOARD_EVENT_RECEIVER, MouseButton } from '@app/constants';
import { MouseManagerService } from '@app/services/mouse-manager.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent implements OnChanges {
    @Input() keyboardReceiver: string;
    @Output() keyboardReceiverChange = new EventEmitter<string>();
    @Output() isInside = new EventEmitter<boolean>();

    tiles: EaselTile[] = [];
    constructor(readonly playerService: PlayerService, private mouseManager: MouseManagerService) {
        this.tiles = this.playerService.mainPlayer.easel.tiles;
        if (this.keyboardReceiver !== KEYBOARD_EVENT_RECEIVER.easel)
            this.tiles.forEach((easelTile) => {
                easelTile.state = TileState.None;
            });
    }

    @HostListener('mousedown', ['$event'])
    mouseClick(event: MouseEvent) {
        if (event.button === MouseButton.Left || event.button === MouseButton.Right) {
            this.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
            this.keyboardReceiverChange.emit(KEYBOARD_EVENT_RECEIVER.easel);
            this.isInside.emit(true);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.keyboardReceiver) {
            if (this.keyboardReceiver !== KEYBOARD_EVENT_RECEIVER.easel) this.resetTileState();
        }
    }

    resetTileState() {
        this.tiles.forEach((easelTile) => {
            easelTile.state = TileState.None;
        });
    }

    tileClicked(tile: EaselTile, event: MouseEvent): void {
        if (this.mouseManager.easelMouseClicked(true, event) === TileState.Manipulation) {
            switch (tile.state) {
                case TileState.Manipulation:
                    break;
                // this code follows the project description PDF "scrabble"
                case TileState.Exchange:
                case TileState.None:
                    this.tiles.forEach((easelTile) => {
                        easelTile.state = TileState.None;
                    });
                    tile.state = TileState.Manipulation;
                    break;

                // // this code follows the issues description
                // case TileState.Exchange:
                //     break;
                // case TileState.None:
                //     this.tiles.forEach((easelTile) => {
                //         if (easelTile.state === TileState.Manipulation) easelTile.state = TileState.None;
                //     });
                //     tile.state = TileState.Manipulation;
                //     break;
            }
        }
        if (this.mouseManager.easelMouseClicked(true, event) === TileState.Exchange) {
            switch (tile.state) {
                case TileState.Exchange:
                    tile.state = TileState.None;
                    break;
                // if we want to respect the issues instead of the project description PDF "scrabble", we add a break in the manipulation case;
                case TileState.Manipulation:
                case TileState.None:
                    tile.state = TileState.Exchange;
                    break;
            }
        }
    }
}
