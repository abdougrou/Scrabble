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
    buttonPressed = '';

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

    @HostListener('document:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (this.keyboardReceiver === KEYBOARD_EVENT_RECEIVER.easel) {
            this.buttonPressed = event.key;
            if (event.shiftKey && event.key === '*') {
                this.buttonPressed = '*';
            }
            if (event.key === 'ArrowRight') this.moveRight();
            else if (event.key === 'ArrowLeft') this.moveLeft();
            else {
                if (this.containsTile(event.key.toLowerCase())) {
                    this.selectTileForManipulation(this.tileKeyboardClicked(event.key.toLowerCase()));
                } else if (!event.shiftKey) {
                    this.tiles.forEach((easelTile) => {
                        if (easelTile.state === TileState.Manipulation) easelTile.state = TileState.None;
                    });
                }
            }
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

    containsTile(tileLetter: string): boolean {
        let found = false;
        this.tiles.forEach((easelTile) => {
            if (easelTile.tile.letter === tileLetter) {
                found = true;
            }
        });
        return found;
    }

    tileKeyboardClicked(letter: string): EaselTile {
        const NOT_PRESENT = -1;
        let indexOfFirstOccuredTile = NOT_PRESENT;
        let indexOfManipulatedTile = NOT_PRESENT;
        let indexOfNextOccurance = NOT_PRESENT;
        // We try to find the first occurance of the tile with the selected letter
        this.tiles.forEach((easelTile) => {
            if (easelTile.tile.letter === letter && indexOfFirstOccuredTile === NOT_PRESENT) {
                indexOfFirstOccuredTile = this.tiles.indexOf(easelTile);
            }
        });
        // We try to see if there is a tile already in manipulation state
        this.tiles.forEach((easelTile) => {
            if (easelTile.state === TileState.Manipulation && indexOfManipulatedTile === NOT_PRESENT)
                indexOfManipulatedTile = this.tiles.indexOf(easelTile);
        });
        // we take the first occurance if there is no manipulated tile already
        // or if the manipulated tile is not the same as the one we are looking for
        if (
            indexOfManipulatedTile === NOT_PRESENT ||
            this.tiles[indexOfFirstOccuredTile].tile.letter !== this.tiles[indexOfManipulatedTile].tile.letter
        ) {
            return this.tiles[indexOfFirstOccuredTile];
        } else {
            this.tiles.forEach((easelTile) => {
                if (easelTile.tile.letter === letter && indexOfNextOccurance === NOT_PRESENT) {
                    indexOfNextOccurance = this.tiles.indexOf(easelTile, indexOfManipulatedTile + 1);
                }
            });
            if (indexOfNextOccurance === NOT_PRESENT) return this.tiles[indexOfFirstOccuredTile];
            else return this.tiles[indexOfNextOccurance];
        }
    }

    tileClicked(tile: EaselTile, event: MouseEvent): void {
        if (this.mouseManager.easelMouseClicked(true, event) === TileState.Manipulation) {
            this.selectTileForManipulation(tile);
        }
        if (this.mouseManager.easelMouseClicked(true, event) === TileState.Exchange) {
            this.selectTileForExchange(tile);
        }
    }

    selectTileForManipulation(tile: EaselTile) {
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

    selectTileForExchange(tile: EaselTile) {
        switch (tile.state) {
            case TileState.Exchange:
                tile.state = TileState.None;
                break;
            // if we want to respect the issues instead of the project description PDF "scrabble", we add a break in the manipulation case;
            case TileState.Manipulation:
            case TileState.None:
                // check if current player turn
                tile.state = TileState.Exchange;
                break;
        }
    }

    moveLeft() {}

    moveRight() {}

    // selectTileWithKeyboard(event: KeyboardEvent) {}
}
