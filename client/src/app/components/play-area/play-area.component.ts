import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@app/constants';
import { GridService } from '@app/services/grid.service';
import { PlayerService } from '@app/services/player.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('canvas', { static: false }) gridCanvas!: ElementRef<HTMLCanvasElement>;

    tiles: Tile[] = [];
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    private canvasSize = { x: CANVAS_WIDTH, y: CANVAS_HEIGHT };

    constructor(private readonly gridService: GridService, readonly playerService: PlayerService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        console.log(this.playerService);
        this.tiles = this.playerService.mainPlayer.easel.tiles;

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

    // // TODO : déplacer ceci dans un service de gestion de la souris!
    // mouseHitDetect(event: MouseEvent) {
    //     if (event.button === MouseButton.Left) {
    //         this.mousePosition = { x: event.offsetX, y: event.offsetY };
    //     }
    // }
}
