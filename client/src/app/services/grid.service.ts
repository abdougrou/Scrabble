/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_MULTIPLIER, COLS, CANVAS_HEIGHT, CANVAS_WIDTH, GRID_SIZE, TILE_COLORS, STEP, ROWS, TILE_TEXT_COLOR } from '@app/constants';
import { BoardService } from './board.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: CANVAS_WIDTH, y: CANVAS_HEIGHT };

    constructor(private board: BoardService) {}

    drawGridIds() {
        const startPositionX: Vec2 = { x: (-20 + STEP) / 2, y: CANVAS_HEIGHT - (-20 + STEP) };
        const startPositionY: Vec2 = { x: CANVAS_WIDTH - (20 + STEP) / 2, y: (20 + STEP) / 2 };
        this.gridContext.fillStyle = 'black';
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

    drawMultiplierTile(coord: Vec2, multiplier: number) {
        switch (multiplier) {
            case 0:
                this.colorTile(coord, TILE_COLORS.tile);
                break;
            case 1:
                this.colorTile(coord, TILE_COLORS.l2);
                break;
            case 2:
                this.colorTile(coord, TILE_COLORS.l3);
                break;
            case 3:
                this.colorTile(coord, TILE_COLORS.w2);
                break;
            case 4:
                this.colorTile(coord, TILE_COLORS.w3);
                break;
        }
    }

    drawTile(coord: Vec2, tile: Tile) {
        this.colorTile(coord, 'burlywood');
        let offsetX = STEP - 11;
        let offsetY = STEP - 5;
        this.gridContext.font = '14px system-ui';
        this.gridContext.fillStyle = 'black';
        this.gridContext.fillText(tile.points.toString(), coord.x * STEP + offsetX, coord.y * STEP + offsetY);
        this.gridContext.font = 'bold 25px system-ui';
        offsetX = STEP - 28;
        offsetY = STEP - 15;
        this.gridContext.fillText(tile.letter.toString(), coord.x * STEP + offsetX, coord.y * STEP + offsetY);
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
                if (tile) this.drawTile(coord, tile);
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
