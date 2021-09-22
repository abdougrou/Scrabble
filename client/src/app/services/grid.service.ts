import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    BOARD_MULTIPLIER,
    COLS,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    GRID_SIZE,
    L2_MULTIPLIER,
    L3_MULTIPLIER,
    NO_MULTIPLIER,
    ROWS,
    W2_MULTIPLIER,
    W3_MULTIPLIER,
} from '@app/constants';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter
@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid(height: number, width: number, nbOfLines: number) {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;

        for (let index = 0; index < nbOfLines; index++) {
            this.gridContext.moveTo((width * 0) / nbOfLines, (height * index) / nbOfLines);
            this.gridContext.lineTo((width * 15) / nbOfLines, (height * index) / nbOfLines);
            this.gridContext.moveTo((width * index) / nbOfLines, (height * 0) / nbOfLines);
            this.gridContext.lineTo((width * index) / nbOfLines, (height * 15) / nbOfLines);
        }
        this.gridContext.stroke();
    }

    drawTilesIds(height: number, width: number, nbOfLines: number) {
        const step = height / nbOfLines;
        const startPositionX: Vec2 = { x: (-20 + step) / 2, y: height - (-20 + step) };
        const startPositionY: Vec2 = { x: width - (20 + step) / 2, y: (20 + step) / 2 };
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < GRID_SIZE; i++) {
            this.gridContext.fillText(COLS[i].toString(), startPositionX.x + step * i, startPositionX.y);
        }
        for (let i = 0; i < GRID_SIZE; i++) {
            this.gridContext.fillText(ROWS[i], startPositionY.x, startPositionY.y + step * i);
        }
    }

    colourTile(x: number, y: number, colour: string) {
        const step = DEFAULT_HEIGHT / (GRID_SIZE + 1);
        this.gridContext.beginPath();
        this.gridContext.rect(x * step, y * step, step, step);
        this.gridContext.fillStyle = colour;
        this.gridContext.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.gridContext.fill();
    }

    colourTiles() {
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const multiplier = BOARD_MULTIPLIER[i][j];
                switch (multiplier) {
                    case 0: {
                        this.colourTile(i, j, NO_MULTIPLIER);
                        break;
                    }
                    case 1: {
                        this.colourTile(i, j, L2_MULTIPLIER);
                        break;
                    }
                    case 2: {
                        this.colourTile(i, j, L3_MULTIPLIER);
                        break;
                    }
                    case 3: {
                        this.colourTile(i, j, W2_MULTIPLIER);
                        break;
                    }
                    case 4: {
                        this.colourTile(i, j, W3_MULTIPLIER);
                        break;
                    }
                }
            }
        }
    }

    /* drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };
        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    } */

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
