import { Injectable } from '@angular/core';
import { TileCoords } from '@app/classes/tile';
import { BOARD_SIZE, DOWN_ARROW, GRID_HEIGHT, GRID_WIDTH, INVALID_COORDS, RIGHT_ARROW } from '@app/constants';
import { PlaceResult } from '@common/command-result';
import { Vec2 } from '@common/vec2';
import { BehaviorSubject } from 'rxjs';
import { BoardService } from './board.service';
import { GameManagerInterfaceService } from './game-manager-interface.service';
import { GridService } from './grid.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceTilesService {
    directionIndicator: TileCoords = { letter: RIGHT_ARROW, coords: { x: -1, y: -1 } };
    tilesTakenFromEasel: string[] = [];
    tilesPlacedOnBoard: TileCoords[] = [];
    updateEasel: BehaviorSubject<string> = new BehaviorSubject('');

    constructor(private gridService: GridService, private boardService: BoardService, private generalGameManager: GameManagerInterfaceService) {}

    manageClick(mouseCoords: Vec2) {
        const tileCoord: Vec2 = this.getBoardTileFromMouse(mouseCoords);
        if (this.generalGameManager.getCurrentPlayer().name === this.generalGameManager.getMainPlayer().name) {
            this.setCurrentTile(tileCoord);
        }
    }

    setCurrentTile(tileCoord: Vec2) {
        if (this.tilesPlacedOnBoard.length === 0) {
            if (!this.boardService.getLetter(tileCoord)) {
                if (this.directionIndicator.coords !== INVALID_COORDS) this.removeIndicator();
                this.directionIndicator.letter = RIGHT_ARROW;
                this.directionIndicator.coords = tileCoord;
                this.placeIndicator();
            } else if ((this.boardService.getLetter(tileCoord) as string) === RIGHT_ARROW) {
                this.changeDirection();
            }
        }
    }

    removeIndicator() {
        if (this.directionIndicator.coords.x !== INVALID_COORDS.x && this.directionIndicator.coords.x !== INVALID_COORDS.x) {
            this.boardService.setLetter(this.directionIndicator.coords, '');
        }
        this.gridService.drawBoard();
    }

    placeIndicator() {
        this.boardService.setLetter(this.directionIndicator.coords, this.directionIndicator.letter);
        this.gridService.drawBoard();
    }

    changeDirection() {
        this.removeIndicator();
        if (this.directionIndicator.letter === RIGHT_ARROW) {
            this.directionIndicator.letter = DOWN_ARROW;
        } else {
            this.directionIndicator.letter = RIGHT_ARROW;
        }
        this.placeIndicator();
    }

    manageKeyboard(key: string) {
        if (this.generalGameManager.getCurrentPlayer().name === this.generalGameManager.getCurrentPlayer().name) {
            switch (key) {
                case 'Backspace': {
                    this.returnLastTileToEasel();
                    break;
                }
                case 'Enter': {
                    this.placeTiles();
                    break;
                }
                case 'Escape': {
                    this.endPlacement();
                    break;
                }
                default: {
                    if (this.directionIndicator.coords !== INVALID_COORDS) {
                        //  source: https://stackoverflow.com/a/37511463
                        key = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                        let easelLetter: string = key;
                        if (key !== '*') {
                            if (key === key.toUpperCase()) {
                                easelLetter = '*';
                                key = key.toLowerCase();
                            }
                            if (this.generalGameManager.mainPlayer.easel.contains(easelLetter.split(''))) {
                                this.putEaselTileOnBoard(easelLetter, key);
                                this.findNextEmptyTile();
                            }
                        }
                    }
                    break;
                }
            }
        }
        this.updateEasel.next('update');
    }

    returnLastTileToEasel() {
        if (this.tilesPlacedOnBoard.length > 0 && this.tilesTakenFromEasel.length > 0) {
            const tileToRemove: TileCoords = this.tilesPlacedOnBoard.pop() as TileCoords;
            const tilesToReturn: string = this.tilesTakenFromEasel.pop() as string;

            this.generalGameManager.getCurrentPlayer().easel.addLetters([tilesToReturn]);
            this.boardService.data[tileToRemove.coords.x][tileToRemove.coords.y] = null;

            this.removeIndicator();
            this.directionIndicator.coords = tileToRemove.coords;
            this.placeIndicator();
        }
    }

    placeTiles() {
        let initialCoord: Vec2 = this.tilesPlacedOnBoard[0].coords;
        while (
            this.boardService.getLetter(
                this.directionIndicator.letter === RIGHT_ARROW
                    ? { x: initialCoord.x - 1, y: initialCoord.y }
                    : { x: initialCoord.x, y: initialCoord.y - 1 },
            )
        ) {
            initialCoord =
                this.directionIndicator.letter === RIGHT_ARROW
                    ? { x: initialCoord.x - 1, y: initialCoord.y }
                    : { x: initialCoord.x, y: initialCoord.y - 1 };
        }

        let coordIterator: Vec2 = initialCoord;
        let word = '';
        while (this.boardService.getLetter(coordIterator)) {
            word += this.boardService.getLetter(coordIterator);
            coordIterator =
                this.directionIndicator.letter === RIGHT_ARROW
                    ? { x: coordIterator.x + 1, y: coordIterator.y }
                    : { x: coordIterator.x, y: coordIterator.y + 1 };
        }
        if (
            this.generalGameManager.placeTilesMouse(
                word,
                initialCoord,
                this.directionIndicator.letter === DOWN_ARROW,
                this.generalGameManager.getCurrentPlayer(),
            ) === PlaceResult.Success
        ) {
            this.removeIndicator();
            this.directionIndicator.coords = INVALID_COORDS;
            this.directionIndicator.letter = RIGHT_ARROW;
            this.tilesPlacedOnBoard.splice(0, this.tilesPlacedOnBoard.length);
            this.tilesTakenFromEasel.splice(0, this.tilesTakenFromEasel.length);
            this.gridService.drawBoard();
        } else {
            this.endPlacement();
        }
    }

    endPlacement() {
        while (this.tilesPlacedOnBoard.length > 0 && this.tilesTakenFromEasel.length > 0) {
            this.returnLastTileToEasel();
        }
        this.removeIndicator();
        this.directionIndicator.coords = INVALID_COORDS;
        this.directionIndicator.letter = RIGHT_ARROW;
        this.tilesPlacedOnBoard.splice(0, this.tilesPlacedOnBoard.length);
        this.tilesTakenFromEasel.splice(0, this.tilesTakenFromEasel.length);
        this.gridService.drawBoard();
    }

    // eslint-disable-next-line no-unused-vars
    putEaselTileOnBoard(easelLetter: string, boardLetter: string) {
        const tileTaken: string = this.generalGameManager.mainPlayer.easel.getLetters([easelLetter]).pop() as string;

        const tileToPlace: string = boardLetter;
        this.removeIndicator();
        this.boardService.setLetter(this.directionIndicator.coords, boardLetter);

        this.tilesTakenFromEasel.push(tileTaken);
        this.tilesPlacedOnBoard.push({ letter: tileToPlace, coords: this.directionIndicator.coords });

        this.gridService.drawBoard();
    }

    findNextEmptyTile(): boolean {
        const index = this.directionIndicator.letter === RIGHT_ARROW ? this.directionIndicator.coords.x + 1 : this.directionIndicator.coords.y + 1;
        for (let i = index; i < BOARD_SIZE; i++) {
            const coord: Vec2 =
                this.directionIndicator.letter === RIGHT_ARROW
                    ? { x: i, y: this.directionIndicator.coords.y }
                    : { x: this.directionIndicator.coords.x, y: i };
            if (!this.boardService.getLetter(coord)) {
                this.directionIndicator.coords = coord;
                this.placeIndicator();
                return true;
            }
        }
        this.directionIndicator.coords = INVALID_COORDS;
        return false;
    }

    getBoardTileFromMouse(mouseCoords: Vec2): Vec2 {
        const tileWidth = GRID_WIDTH / BOARD_SIZE;
        const tileHeight = GRID_HEIGHT / BOARD_SIZE;
        const x = (mouseCoords.x - (mouseCoords.x % tileWidth)) / tileWidth;
        const y = (mouseCoords.y - (mouseCoords.y % tileHeight)) / tileHeight;
        return { x, y };
    }
}
