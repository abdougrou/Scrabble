import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '@app/classes/player';
import { EaselTile, TileState } from '@app/classes/tile';
import { KEYBOARD_EVENT_RECEIVER, LETTER_POINTS, MouseButton } from '@app/constants';
import { GameManagerInterfaceService } from '@app/services/game-manager-interface.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { MouseManagerService } from '@app/services/mouse-manager.service';
import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';
import { PlaceTilesService } from '@app/services/place-tiles.service';
import { ReserveService } from '@app/services/reserve.service';

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
    players: Player[];
    buttonPressed = '';
    mainPlayerName;
    exchangableTiles = false;
    numTilesReserve;
    mainPlayer: Player;
    letterPoints: Map<string, number> = LETTER_POINTS;

    constructor(
        private mouseManager: MouseManagerService,
        private reserve: ReserveService,
        private gameManager: GameManagerService,
        private multiGameManager: MultiplayerGameManagerService,
        private generalGameManagerService: GameManagerInterfaceService,
        private router: Router,
        private placeTilesService: PlaceTilesService,
    ) {
        if (this.router.url === '/multiplayer-game') {
            this.players = this.multiGameManager.players;
            this.tiles = this.generalGameManagerService.mainPlayer.easel.letters.map((letter) => {
                return { letter, state: TileState.None } as EaselTile;
            });
            this.mainPlayerName = this.multiGameManager.getMainPlayer().name;
        } else {
            this.mainPlayerName = this.gameManager.gameConfig.playerName1;
            this.tiles = this.gameManager.players.mainPlayer.easel.letters.map((letter) => {
                return { letter, state: TileState.None } as EaselTile;
            });
            this.players = this.gameManager.players.players;
        }

        if (this.keyboardReceiver !== KEYBOARD_EVENT_RECEIVER.easel)
            for (const easelTile of this.tiles) {
                easelTile.state = TileState.None;
            }

        this.numTilesReserve = this.reserve.size;
        this.mainPlayer = this.generalGameManagerService.mainPlayer;
        this.multiGameManager.updatePlayer.asObservable().subscribe((msg) => {
            this.update(msg);
        });
        this.placeTilesService.updateEasel.asObservable().subscribe((msg) => {
            this.updateEasel(msg);
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
            if (event.shiftKey && event.key === '*') {
                this.buttonPressed = '*';
            }
            if (event.key === 'ArrowRight') {
                this.moveRight();
            } else if (event.key === 'ArrowLeft') this.moveLeft();
            else {
                this.buttonPressed = event.key;
                if (this.containsTile(event.key.toLowerCase())) {
                    this.selectTileForManipulation(this.tileKeyboardClicked(event.key.toLowerCase()));
                } else if (!event.shiftKey && !event.ctrlKey) {
                    this.resetTileState();
                }
            }
        }
    }

    @HostListener('document:wheel', ['$event'])
    scroll(event: WheelEvent) {
        if (this.keyboardReceiver === KEYBOARD_EVENT_RECEIVER.easel) {
            if (event.deltaY < 0) this.moveLeft();
            else if (event.deltaY > 0) this.moveRight();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.keyboardReceiver) {
            if (this.keyboardReceiver !== KEYBOARD_EVENT_RECEIVER.easel) this.resetTileState();
        }
    }

    update(msg: string) {
        if (msg === 'updated') {
            // window.alert('ok');
            // this.tiles = this.generalGameManagerService.mainPlayer.easel.letters;
        }
    }

    updateEasel(msg: string) {
        if (msg === 'update') {
            this.tiles = this.generalGameManagerService.mainPlayer.easel.letters.map((letter) => {
                return { letter, state: TileState.None } as EaselTile;
            });
        }
    }

    resetTileState() {
        for (const easelTile of this.tiles) {
            easelTile.state = TileState.None;
        }
        this.exchangableTiles = false;
    }

    containsTile(tileLetter: string): boolean {
        let found = false;
        for (const easelTile of this.tiles) {
            if (easelTile.letter === tileLetter) {
                found = true;
            }
        }
        return found;
    }

    tileKeyboardClicked(letter: string): EaselTile {
        const NOT_PRESENT = -1;
        let indexOfFirstOccuredTile = NOT_PRESENT;
        let indexOfManipulatedTile = NOT_PRESENT;
        let indexOfNextOccurance = NOT_PRESENT;
        // We try to find the first occurance of the tile with the selected letter
        for (const easelTile of this.tiles) {
            if (easelTile.letter === letter && indexOfFirstOccuredTile === NOT_PRESENT) {
                indexOfFirstOccuredTile = this.tiles.indexOf(easelTile);
            }
        }
        // We try to see if there is a tile already in manipulation state
        for (const easelTile of this.tiles) {
            if (easelTile.state === TileState.Manipulation && indexOfManipulatedTile === NOT_PRESENT)
                indexOfManipulatedTile = this.tiles.indexOf(easelTile);
        }
        // we take the first occurance if there is no manipulated tile already
        // or if the manipulated tile is not the same as the one we are looking for
        if (indexOfManipulatedTile === NOT_PRESENT || this.tiles[indexOfFirstOccuredTile].letter !== this.tiles[indexOfManipulatedTile].letter) {
            return this.tiles[indexOfFirstOccuredTile];
        } else {
            for (const easelTile of this.tiles) {
                if (easelTile.letter === letter && indexOfNextOccurance === NOT_PRESENT) {
                    indexOfNextOccurance = this.tiles.indexOf(easelTile, indexOfManipulatedTile + 1);
                }
            }
            if (indexOfNextOccurance === NOT_PRESENT) return this.tiles[indexOfFirstOccuredTile];
            else return this.tiles[indexOfNextOccurance];
        }
    }

    tileClicked(tile: EaselTile, event: MouseEvent): void {
        if (this.mouseManager.easelMouseClicked(true, event) === TileState.Manipulation) {
            this.selectTileForManipulation(tile);
            this.exchangableTiles = false;
        }
        if (this.mouseManager.easelMouseClicked(true, event) === TileState.Exchange) {
            this.selectTileForExchange(tile);
            this.exchangableTiles = true;
        }
        let exchangeable = false;
        for (const easelTile of this.tiles) {
            if (easelTile.state === TileState.Exchange) exchangeable = true;
        }
        this.exchangableTiles = exchangeable;
    }

    selectTileForManipulation(tile: EaselTile) {
        for (const easelTile of this.tiles) {
            easelTile.state = TileState.None;
        }
        tile.state = TileState.Manipulation;
    }

    selectTileForExchange(tile: EaselTile) {
        for (const easelTile of this.tiles) {
            if (easelTile.state === TileState.Manipulation) easelTile.state = TileState.None;
        }
        switch (tile.state) {
            case TileState.Exchange:
                tile.state = TileState.None;
                break;
            case TileState.Manipulation:
            case TileState.None:
                tile.state = TileState.Exchange;
                break;
        }
    }

    moveLeft() {
        const NOT_PRESENT = -1;
        let indexOfManipulatedTile = NOT_PRESENT;
        for (const easelTile of this.tiles) {
            if (easelTile.state === TileState.Manipulation && indexOfManipulatedTile === NOT_PRESENT) {
                indexOfManipulatedTile = this.tiles.indexOf(easelTile);
            }
        }
        if (indexOfManipulatedTile !== NOT_PRESENT) {
            if (indexOfManipulatedTile !== 0) {
                const tempTile: EaselTile = this.tiles[indexOfManipulatedTile - 1];
                this.tiles[indexOfManipulatedTile - 1] = this.tiles[indexOfManipulatedTile];
                this.tiles[indexOfManipulatedTile] = tempTile;
            } else {
                const tempTile: EaselTile = this.tiles[indexOfManipulatedTile];
                this.tiles.shift();
                this.tiles.push(tempTile);
            }
        }
    }

    moveRight() {
        const NOT_PRESENT = -1;
        let indexOfManipulatedTile = NOT_PRESENT;
        for (const easelTile of this.tiles) {
            if (easelTile.state === TileState.Manipulation && indexOfManipulatedTile === NOT_PRESENT) {
                indexOfManipulatedTile = this.tiles.indexOf(easelTile);
            }
        }

        if (indexOfManipulatedTile !== NOT_PRESENT) {
            if (indexOfManipulatedTile !== this.tiles.length - 1) {
                const tempTile: EaselTile = this.tiles[indexOfManipulatedTile + 1];
                this.tiles[indexOfManipulatedTile + 1] = this.tiles[indexOfManipulatedTile];
                this.tiles[indexOfManipulatedTile] = tempTile;
            } else {
                const tempTile: EaselTile = this.tiles[indexOfManipulatedTile];
                this.tiles.pop();
                this.tiles.reverse();
                this.tiles.push(tempTile);
                this.tiles.reverse();
            }
        }
    }

    exchangeTiles() {
        let tilesToExchange = '';
        for (const easelTile of this.tiles) {
            if (easelTile.state === TileState.Exchange) tilesToExchange += easelTile.letter;
        }
        if (this.router.url === '/multiplayer-game') {
            this.multiGameManager.exchangeLetters(tilesToExchange, this.multiGameManager.getMainPlayer());
            this.multiGameManager.switchPlayers();
        } else {
            this.gameManager.exchangeLetters(this.generalGameManagerService.getMainPlayer(), tilesToExchange.split(''));
        }
        this.resetTileState();
        this.tiles = this.generalGameManagerService.mainPlayer.easel.letters.map((letter) => {
            return { letter, state: TileState.None } as EaselTile;
        });
    }
}
