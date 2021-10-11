import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@app/constants';
import { GridService } from '@app/services/grid.service';
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

    tiles: Tile[] = [];
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    private canvasSize = { x: CANVAS_WIDTH, y: CANVAS_HEIGHT };

    constructor(private readonly gridService: GridService) {}

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
