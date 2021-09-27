/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import {
    BOARD_MULTIPLIER,
    COLS,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    GRID_SIZE,
    TILE_COLORS,
    STEP,
    ROWS,
    TILE_TEXT_COLOR,
    LETTER_OFFSET,
    INDEX_OFFSET,
    BASE_LETTER_FONT_SIZE,
    BASE_INDEX_FONT_SIZE,
} from '@app/constants';
import { BoardService } from './board.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: CANVAS_WIDTH, y: CANVAS_HEIGHT };

    constructor(private board: BoardService) {}

    drawGridIds() {
        const startPositionX: Vec2 = { x: STEP / 2, y: CANVAS_HEIGHT - STEP / 2 };
        const startPositionY: Vec2 = { x: CANVAS_WIDTH - STEP / 2, y: STEP / 2 };
        this.gridContext.fillStyle = 'black';
        this.gridContext.textBaseline = 'middle';
        this.gridContext.textAlign = 'center';
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < GRID_SIZE; i++) {
            this.gridContext.fillText(COLS[i].toString(), startPositionX.x + STEP * i, startPositionX.y);
        }
        for (let i = 0; i < GRID_SIZE; i++) {
            this.gridContext.fillText(ROWS[i], startPositionY.x, startPositionY.y + STEP * i);
        }
    }

    colorTile(coord: Vec2, colour: string) {
        this.gridContext.beginPath();
        this.gridContext.rect(coord.x * STEP, coord.y * STEP, STEP - 1, STEP - 1);
        this.gridContext.fillStyle = colour;
        this.gridContext.strokeStyle = TILE_TEXT_COLOR;
        this.gridContext.fill();
    }

    drawMultiplierText(coord: Vec2, multiplierType: string, multiplier: number) {
        this.gridContext.font = 'bold 10px system-ui';
        this.gridContext.fillStyle = 'black';
        this.gridContext.textBaseline = 'bottom';
        this.gridContext.textAlign = 'center';
        this.gridContext.fillText(multiplierType, coord.x * STEP + LETTER_OFFSET, coord.y * STEP + LETTER_OFFSET);
        this.gridContext.textBaseline = 'top';
        this.gridContext.fillText('x ' + multiplier.toString(), coord.x * STEP + LETTER_OFFSET, coord.y * STEP + LETTER_OFFSET);
    }

    drawMultiplierTile(coord: Vec2, multiplier: number) {
        switch (multiplier) {
            case 0:
                this.colorTile(coord, TILE_COLORS.tile);
                break;
            case 1: {
                this.colorTile(coord, TILE_COLORS.l2);
                this.drawMultiplierText(coord, 'LETTRE', 2);
                break;
            }
            case 2:
                this.colorTile(coord, TILE_COLORS.l3);
                this.drawMultiplierText(coord, 'LETTRE', 3);
                break;
            case 3:
                this.colorTile(coord, TILE_COLORS.w2);
                this.drawMultiplierText(coord, 'MOT', 2);
                break;
            case 4:
                this.colorTile(coord, TILE_COLORS.w3);
                this.drawMultiplierText(coord, 'MOT', 3);
                break;
        }
    }

    drawTile(coord: Vec2, tile: Tile, letterFontSize: number, indexFontSize: number) {
        this.colorTile(coord, 'burlywood');
        this.gridContext.textBaseline = 'middle';
        this.gridContext.textAlign = 'center';
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = `bold ${letterFontSize}px system-ui`;
        this.gridContext.fillText(tile.letter.toUpperCase(), coord.x * STEP + LETTER_OFFSET, coord.y * STEP + LETTER_OFFSET);
        this.gridContext.font = `${indexFontSize}px system-ui`;
        this.gridContext.fillText(tile.points.toString().toUpperCase(), coord.x * STEP + INDEX_OFFSET, coord.y * STEP + INDEX_OFFSET);
    }

    drawBoard() {
        this.gridContext.beginPath();
        this.gridContext.rect(0, 0, CANVAS_HEIGHT - STEP, CANVAS_WIDTH - STEP);
        this.gridContext.fillStyle = 'black';
        this.gridContext.fill();
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const coord: Vec2 = { x: i, y: j };
                const tile: Tile | undefined = this.board.getTile(coord);
                if (tile) this.drawTile(coord, tile, BASE_LETTER_FONT_SIZE, BASE_INDEX_FONT_SIZE);
                else this.drawMultiplierTile(coord, BOARD_MULTIPLIER[i][j]);
            }
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
