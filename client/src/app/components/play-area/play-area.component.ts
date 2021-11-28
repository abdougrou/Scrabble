import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { TileCoords } from '@app/classes/tile';
import { CANVAS_HEIGHT, CANVAS_WIDTH, INVALID_COORDS, KEYBOARD_EVENT_RECEIVER } from '@app/constants';
import { GridService } from '@app/services/grid.service';
import { PlaceTilesService } from '@app/services/place-tiles.service';
// import { PlaceTilesService } from '@app/services/place-tiles.service';
import { PlayerService } from '@app/services/player.service';
import { Vec2 } from '@common/vec2';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('canvas', { static: false }) gridCanvas!: ElementRef<HTMLCanvasElement>;

    @Input() keyboardReceiver: string;
    @Output() keyboardReceiverChange = new EventEmitter<string>();
    @Output() isInside = new EventEmitter<boolean>();

    tilesPlacedOnBoard: TileCoords[] = [];
    private canvasSize = { x: CANVAS_WIDTH, y: CANVAS_HEIGHT };

    constructor(private readonly gridService: GridService, public placeTilesService: PlaceTilesService, private playerService: PlayerService) {
        this.tilesPlacedOnBoard = this.placeTilesService.tilesPlacedOnBoard;
        this.playerService.endTurn.asObservable().subscribe((msg) => {
            this.manageEndTurn(msg);
        });
    }

    @HostListener('document:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (this.keyboardReceiver === KEYBOARD_EVENT_RECEIVER.board) {
            this.placeTilesService.manageKeyboard(event.key);
            this.drawTempTileBorders();
        } else {
            this.placeTilesService.endPlacement();
        }
    }

    drawTempTileBorders() {
        for (const tile of this.tilesPlacedOnBoard) {
            this.gridService.borderTile(tile.coords);
        }
        if (
            this.placeTilesService.directionIndicator.coords.x !== INVALID_COORDS.x &&
            this.placeTilesService.directionIndicator.coords.y !== INVALID_COORDS.y
        ) {
            this.gridService.borderTile(this.placeTilesService.directionIndicator.coords);
        }
    }

    manageEndTurn(msg: string) {
        if (msg === 'a') this.placeTilesService.endPlacement();
    }

    clickOnBoard(event: MouseEvent) {
        this.changeKeyboardReceiver(KEYBOARD_EVENT_RECEIVER.board);
        this.clickedInside(true);
        const coords: Vec2 = { x: event.offsetX, y: event.offsetY };
        this.placeTilesService.manageClick(coords);
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawBoard();
        this.gridService.drawGridIds();
        this.gridCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    changeKeyboardReceiver(newKeyboardReceiver: string) {
        this.keyboardReceiver = newKeyboardReceiver;
        this.keyboardReceiverChange.emit(newKeyboardReceiver);
    }

    clickedInside(isInside: boolean) {
        this.isInside.emit(isInside);
    }
}
