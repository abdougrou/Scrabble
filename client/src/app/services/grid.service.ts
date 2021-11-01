import { Injectable } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import {
    BASE_LETTER_FONT_SIZE,
    BASE_POINT_FONT_SIZE,
    BOARD_MULTIPLIER,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    COLS,
    GRID_HEIGHT,
    GRID_SIZE,
    GRID_WIDTH,
    INVALID_POINT,
    LETTER_FONT_SIZE_MODIFIER,
    LETTER_OFFSET,
    POINT_FONT_SIZE_MODIFIER,
    POINT_OFFSET,
    ROWS,
    STEP,
    TEMP_TILE_COLOR,
    TILE_COLORS,
    TILE_MULTIPLIER,
    TILE_TEXT_COLOR,
    TILE_TYPE,
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

    borderTile(coord: Vec2) {
        this.gridContext.strokeStyle = TEMP_TILE_COLOR;
        this.gridContext.lineWidth = 2;
        this.gridContext.strokeRect(coord.x * STEP + 1, coord.y * STEP + 1, STEP - 3, STEP - 3);
    }

    drawMultiplierText(coord: Vec2, multiplierType: string, multiplier: number) {
        const middle: Vec2 = { x: 7, y: 7 };
        if (coord.x === middle.x && coord.y === middle.y) {
            this.drawStarCenter();
        } else {
            this.gridContext.font = 'bold 10px system-ui';
            this.gridContext.fillStyle = 'black';
            this.gridContext.textBaseline = 'bottom';
            this.gridContext.textAlign = 'center';
            this.gridContext.fillText(multiplierType, coord.x * STEP + LETTER_OFFSET, coord.y * STEP + LETTER_OFFSET);
            this.gridContext.textBaseline = 'top';
            this.gridContext.fillText('x ' + multiplier.toString(), coord.x * STEP + LETTER_OFFSET, coord.y * STEP + LETTER_OFFSET);
        }
    }

    drawMultiplierTile(coord: Vec2, multiplier: number) {
        switch (multiplier) {
            case TILE_TYPE.noBonus:
                this.colorTile(coord, TILE_COLORS.tile);
                break;
            case TILE_TYPE.letterX2: {
                this.colorTile(coord, TILE_COLORS.l2);
                this.drawMultiplierText(coord, 'LETTRE', TILE_MULTIPLIER.l2);
                break;
            }
            case TILE_TYPE.letterX3:
                this.colorTile(coord, TILE_COLORS.l3);
                this.drawMultiplierText(coord, 'LETTRE', TILE_MULTIPLIER.l3);
                break;
            case TILE_TYPE.wordX2:
                this.colorTile(coord, TILE_COLORS.w2);
                this.drawMultiplierText(coord, 'MOT', TILE_MULTIPLIER.w2);
                break;
            case TILE_TYPE.wordX3:
                this.colorTile(coord, TILE_COLORS.w3);
                this.drawMultiplierText(coord, 'MOT', TILE_MULTIPLIER.w3);
                break;
        }
    }

    drawTile(coord: Vec2, tile: Tile, fontSizeModifier: number) {
        const letterFont = BASE_LETTER_FONT_SIZE + fontSizeModifier * LETTER_FONT_SIZE_MODIFIER;
        const pointFont = BASE_POINT_FONT_SIZE + fontSizeModifier * POINT_FONT_SIZE_MODIFIER;
        if (tile.points !== INVALID_POINT) {
            this.colorTile(coord, 'burlywood');
        } else {
            this.colorTile(coord, TEMP_TILE_COLOR);
        }
        this.gridContext.fillStyle = 'black';

        this.gridContext.textBaseline = 'middle';
        this.gridContext.textAlign = 'center';
        this.gridContext.font = `${letterFont}px system-ui`;
        this.gridContext.fillText(tile.letter.toUpperCase(), coord.x * STEP + LETTER_OFFSET, coord.y * STEP + LETTER_OFFSET);

        if (tile.points !== INVALID_POINT) {
            this.gridContext.textBaseline = 'bottom';
            this.gridContext.textAlign = 'right';
            this.gridContext.font = `${pointFont}px system-ui`;
            this.gridContext.fillText(tile.points.toString(), coord.x * STEP + POINT_OFFSET, coord.y * STEP + POINT_OFFSET);
        }
    }

    clearBoard() {
        this.gridContext.clearRect(0, 0, CANVAS_WIDTH - STEP, CANVAS_HEIGHT - STEP);
    }

    drawStarCenter() {
        const x = GRID_WIDTH / 2 - 1;
        const y = GRID_HEIGHT / 2 + 1;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const r = STEP / 4.0;
        const inset = 2;
        const n = 5;
        const rotation = 120;

        this.gridContext.fillStyle = 'black';
        this.gridContext.save();
        this.gridContext.globalAlpha = 0.7;
        this.gridContext.beginPath();
        this.gridContext.translate(x, y);
        this.gridContext.rotate(rotation);
        this.gridContext.moveTo(0, 0 - r);
        for (let i = 0; i < n; i++) {
            this.gridContext.rotate(Math.PI / n);
            this.gridContext.lineTo(0, 0 - r * inset);
            this.gridContext.rotate(Math.PI / n);
            this.gridContext.lineTo(0, 0 - r);
        }
        this.gridContext.closePath();
        this.gridContext.fill();
        this.gridContext.restore();
    }

    drawBoard(fontSizeModifier: number = 0) {
        this.gridContext.beginPath();
        this.gridContext.rect(0, 0, CANVAS_WIDTH - STEP, CANVAS_HEIGHT - STEP);
        this.gridContext.fillStyle = 'black';
        this.gridContext.fill();
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const coord: Vec2 = { x: i, y: j };
                const tile: Tile | undefined = this.board.getTile(coord);
                if (tile) this.drawTile(coord, tile, fontSizeModifier);
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
