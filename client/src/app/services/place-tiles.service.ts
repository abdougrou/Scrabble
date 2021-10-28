import { Injectable } from '@angular/core';
import { Tile, TileCoords } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { GRID_HEIGHT, GRID_SIZE, GRID_WIDTH } from '@app/constants';
import { BoardService } from './board.service';
import { CalculatePointsService } from './calculate-points.service';
import { GridService } from './grid.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { WordValidationService } from './word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceTilesService {
    currentTile: Vec2;
    tilesTakenFromEasel: Tile[] = [];
    tilesPlacedOnBoard: TileCoords[] = [];
    horizontal: boolean = true;
    placementStarted: boolean = false;
    constructor(
        private gridService: GridService,
        private boardService: BoardService,
        private playerService: PlayerService,
        private wordValidation: WordValidationService,
        private calculatePoints: CalculatePointsService,
        private reserveService: ReserveService,
    ) {}

    manageClick(mouseCoords: Vec2) {
        const tileCoord: Vec2 = this.getBoardTileFromMouse(mouseCoords);
        if (this.playerService.current === this.playerService.mainPlayer) {
            this.setCurrentTile(tileCoord);
        }
    }

    setCurrentTile(tileCoord: Vec2) {
        if (!this.boardService.getTile(tileCoord)) {
            if (this.currentTile && this.placementStarted) {
                if (this.currentTile.x === tileCoord.x && this.currentTile.y === tileCoord.y) {
                    this.horizontal = !this.horizontal;
                } else {
                    this.horizontal = true;
                }
            }
            this.currentTile = tileCoord;
            this.placementStarted = true;
        }
    }

    manageKeyboard(key: string) {
        if (this.playerService.current === this.playerService.mainPlayer) {
            switch (key) {
                case 'Backspace': {
                    this.returnLastTileToEasel();
                    break;
                }
                case 'Enter': {
                    this.validatePlacement();
                    break;
                }
                case 'Escape': {
                    this.endPlacement();
                    break;
                }
                default: {
                    if (this.placementStarted) {
                        key = this.wordValidation.removeAccents(key);
                        let easelLetter: string = key;

                        if (key === key.toUpperCase()) {
                            easelLetter = '*';
                            key = key.toLowerCase();
                        }

                        if (this.playerService.mainPlayer.easel.containsTiles(easelLetter)) {
                            if (this.findNextEmptyTile()) this.putEaselTileOnBoard(easelLetter, key);
                        }
                    }
                }
            }
        }
    }

    returnLastTileToEasel() {
        if (this.tilesPlacedOnBoard.length > 0 && this.tilesTakenFromEasel.length > 0) {
            const tileToRemove: TileCoords = this.tilesPlacedOnBoard.pop() as TileCoords;
            const tilesToReturn: Tile[] = [this.tilesTakenFromEasel.pop() as Tile];

            this.playerService.mainPlayer.easel.addTiles(tilesToReturn);
            this.boardService.board.delete(this.boardService.coordToKey(tileToRemove.coords));

            this.currentTile = tileToRemove.coords;
            this.gridService.drawBoard();
        }
    }

    validatePlacement() {
        if (this.tilesPlacedOnBoard.length !== 0) {
            if (this.validateWordPosition() && this.wordValidation.validateWords(this.tilesPlacedOnBoard)) {
                const scoreNewTiles = this.calculatePoints.calculatePoints(this.tilesPlacedOnBoard);
                this.playerService.mainPlayer.score += scoreNewTiles;
                this.playerService.mainPlayer.easel.addTiles(this.reserveService.getLetters(this.tilesPlacedOnBoard.length));
            } else this.endPlacement();
            this.playerService.switchPlayers();
        }
    }

    endPlacement() {
        while (this.tilesPlacedOnBoard.length > 0 && this.tilesTakenFromEasel.length > 0) {
            this.returnLastTileToEasel();
        }
        this.placementStarted = false;
        this.horizontal = true;
        this.gridService.drawBoard();
    }

    putEaselTileOnBoard(easelLetter: string, boardLetter: string) {
        const tileTaken: Tile = this.playerService.mainPlayer.easel.getTiles(easelLetter)[0];

        const tileToPlace: Tile = tileTaken;
        tileToPlace.letter = boardLetter;
        this.boardService.placeTile(this.currentTile, tileToPlace);

        this.tilesTakenFromEasel.push(tileTaken);
        this.tilesPlacedOnBoard.push({ tile: tileToPlace, coords: this.currentTile });

        this.gridService.drawBoard();
    }

    findNextEmptyTile(): boolean {
        const index = this.horizontal ? this.currentTile.x : this.currentTile.y;
        for (let i = index; i < GRID_SIZE; i++) {
            const coord: Vec2 = this.horizontal ? { x: i, y: this.currentTile.y } : { x: this.currentTile.x, y: i };
            if (!this.boardService.getTile(coord)) {
                this.currentTile = coord;
                return true;
            }
        }
        return false;
    }

    getBoardTileFromMouse(mouseCoords: Vec2): Vec2 {
        const tileWidth = GRID_WIDTH / GRID_SIZE;
        const tileHeight = GRID_HEIGHT / GRID_SIZE;
        const x = (mouseCoords.x - (mouseCoords.x % tileWidth)) / tileWidth;
        const y = (mouseCoords.y - (mouseCoords.y % tileHeight)) / tileHeight;
        return { x, y };
    }

    validateWordPosition(): boolean {
        //  First placement
        const boardCenter = 7;
        if (this.boardService.board.size === this.tilesPlacedOnBoard.length) {
            //  Check if word is on center tile
            for (const tile of this.tilesPlacedOnBoard) {
                if (tile.coords.x === boardCenter && tile.coords.y === boardCenter) {
                    return true;
                }
            }
            return false;
        }
        //  Check if word has adjacent tiles
        for (const tile of this.tilesPlacedOnBoard) {
            const firstCoord: Vec2 = this.horizontal ? { x: tile.coords.x, y: tile.coords.y - 1 } : { x: tile.coords.x - 1, y: tile.coords.y };
            const secondCoord: Vec2 = this.horizontal ? { x: tile.coords.x, y: tile.coords.y + 1 } : { x: tile.coords.x + 1, y: tile.coords.y };
            if (this.boardService.getTile(firstCoord) || this.boardService.getTile(secondCoord)) {
                return true;
            }
        }
        return false;
    }
}
