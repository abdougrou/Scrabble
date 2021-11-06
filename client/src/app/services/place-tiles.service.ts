import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Tile, TileCoords } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { DOWN_ARROW, GRID_HEIGHT, GRID_SIZE, GRID_WIDTH, INVALID_COORDS, RIGHT_ARROW } from '@app/constants';
import { BoardService } from './board.service';
import { CalculatePointsService } from './calculate-points.service';
import { GameManagerService } from './game-manager.service';
import { GridService } from './grid.service';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';
import { WordValidationService } from './word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceTilesService {
    directionIndicator: TileCoords = { tile: RIGHT_ARROW, coords: { x: -1, y: -1 } };
    tilesTakenFromEasel: Tile[] = [];
    tilesPlacedOnBoard: TileCoords[] = [];

    constructor(
        private gridService: GridService,
        private boardService: BoardService,
        private playerService: PlayerService,
        private wordValidation: WordValidationService,
        private calculatePoints: CalculatePointsService,
        private reserveService: ReserveService,
        private multiGameManager: MultiplayerGameManagerService,
        private router: Router,
        private gameManager: GameManagerService,
    ) {}

    manageClick(mouseCoords: Vec2) {
        const tileCoord: Vec2 = this.getBoardTileFromMouse(mouseCoords);
        if (this.router.url === '/multiplayer-game') {
            if (this.multiGameManager.players[0].name === this.multiGameManager.mainPlayerName) {
                this.setCurrentTile(tileCoord);
            }
        } else {
            if (this.playerService.current === this.playerService.mainPlayer) {
                this.setCurrentTile(tileCoord);
            }
        }
    }

    setCurrentTile(tileCoord: Vec2) {
        if (this.tilesPlacedOnBoard.length === 0) {
            if (!this.boardService.getTile(tileCoord)) {
                if (this.directionIndicator.coords !== INVALID_COORDS) this.removeIndicator();
                this.directionIndicator.tile = RIGHT_ARROW;
                this.directionIndicator.coords = tileCoord;
                this.placeIndicator();
            } else if (this.boardService.getTile(tileCoord)?.points === RIGHT_ARROW.points) {
                this.changeDirection();
            }
        }
    }

    removeIndicator() {
        if (this.directionIndicator.coords !== INVALID_COORDS) {
            this.boardService.board.delete(this.boardService.coordToKey(this.directionIndicator.coords));
        }
        this.gridService.drawBoard();
    }

    placeIndicator() {
        this.boardService.placeTile(this.directionIndicator.coords, this.directionIndicator.tile);
        this.gridService.drawBoard();
    }

    changeDirection() {
        this.removeIndicator();
        if (this.directionIndicator.tile.letter === RIGHT_ARROW.letter) {
            this.directionIndicator.tile = DOWN_ARROW;
        } else {
            this.directionIndicator.tile = RIGHT_ARROW;
        }
        this.placeIndicator();
    }

    manageKeyboard(key: string) {
        let playerTurn = false;
        let easelContains = false;
        if (this.router.url === '/multiplayer-game') {
            if (this.multiGameManager.players[0].name === this.multiGameManager.mainPlayerName) playerTurn = true;
        } else {
            if (this.playerService.current === this.playerService.mainPlayer) playerTurn = true;
        }
        if (playerTurn) {
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
                    if (this.directionIndicator.coords !== INVALID_COORDS) {
                        key = this.wordValidation.removeAccents(key);
                        let easelLetter: string = key;

                        if (key === key.toUpperCase()) {
                            easelLetter = '*';
                            key = key.toLowerCase();
                        }

                        if (this.router.url === '/multiplayer-game') {
                            if (this.multiGameManager.players[0].easel.containsTiles(easelLetter)) easelContains = true;
                        } else {
                            if (this.playerService.mainPlayer.easel.containsTiles(easelLetter)) easelContains = true;
                        }
                        if (easelContains) {
                            this.putEaselTileOnBoard(easelLetter, key);
                            this.findNextEmptyTile();
                        }
                    }
                }
            }
        }
    }

    returnLastTileToEasel() {
        if (this.tilesPlacedOnBoard.length > 0 && this.tilesTakenFromEasel.length > 0) {
            const tileToRemove: TileCoords = this.tilesPlacedOnBoard.pop() as TileCoords;
            const tilesToReturn: Tile = this.tilesTakenFromEasel.pop() as Tile;

            if (this.router.url === '/multiplayer-game') {
                this.multiGameManager.players[0].easel.addTiles([tilesToReturn]);
            } else {
                this.playerService.mainPlayer.easel.addTiles([tilesToReturn]);
            }
            this.boardService.board.delete(this.boardService.coordToKey(tileToRemove.coords));

            this.removeIndicator();
            this.directionIndicator.coords = tileToRemove.coords;
            this.placeIndicator();
        }
    }

    validatePlacement() {
        if (this.tilesPlacedOnBoard.length !== 0) {
            this.removeIndicator();
            if (this.validateWordPosition() && this.wordValidation.validateWords(this.tilesPlacedOnBoard)) {
                const scoreNewTiles = this.calculatePoints.calculatePoints(this.tilesPlacedOnBoard);
                if (this.router.url === '/multiplayer-game') {
                    this.multiGameManager.players[0].score += scoreNewTiles;
                    this.multiGameManager.players[0].easel.addTiles(this.reserveService.getLetters(this.tilesPlacedOnBoard.length));
                } else {
                    this.playerService.mainPlayer.score += scoreNewTiles;
                    this.playerService.mainPlayer.easel.addTiles(this.reserveService.getLetters(this.tilesPlacedOnBoard.length));
                }

                this.directionIndicator.coords = INVALID_COORDS;
                this.directionIndicator.tile = RIGHT_ARROW;
                this.tilesPlacedOnBoard.splice(0, this.tilesPlacedOnBoard.length);
                this.tilesTakenFromEasel.splice(0, this.tilesTakenFromEasel.length);
            } else this.endPlacement();

            if (this.router.url === '/multiplayer-game') this.multiGameManager.switchPlayers();
            else this.gameManager.switchPlayers();
        }
    }

    endPlacement() {
        while (this.tilesPlacedOnBoard.length > 0 && this.tilesTakenFromEasel.length > 0) {
            this.returnLastTileToEasel();
        }
        this.removeIndicator();
        this.directionIndicator.coords = INVALID_COORDS;
        this.directionIndicator.tile = RIGHT_ARROW;
        this.tilesPlacedOnBoard.splice(0, this.tilesPlacedOnBoard.length);
        this.tilesTakenFromEasel.splice(0, this.tilesTakenFromEasel.length);
        this.gridService.drawBoard();
    }

    putEaselTileOnBoard(easelLetter: string, boardLetter: string) {
        let tileTaken: Tile = { letter: '', points: 0 };
        if (this.router.url === '/multiplayer-game') {
            tileTaken = this.multiGameManager.players[0].easel.getTiles(easelLetter).pop() as Tile;
        } else {
            tileTaken = this.playerService.mainPlayer.easel.getTiles(easelLetter).pop() as Tile;
        }

        const tileToPlace: Tile = { letter: boardLetter, points: tileTaken.points };
        this.removeIndicator();
        this.boardService.placeTile(this.directionIndicator.coords, tileToPlace);

        this.tilesTakenFromEasel.push(tileTaken);
        this.tilesPlacedOnBoard.push({ tile: tileToPlace, coords: this.directionIndicator.coords });

        this.gridService.drawBoard();
    }

    findNextEmptyTile(): boolean {
        const index = this.directionIndicator.tile === RIGHT_ARROW ? this.directionIndicator.coords.x + 1 : this.directionIndicator.coords.y + 1;
        for (let i = index; i < GRID_SIZE; i++) {
            const coord: Vec2 =
                this.directionIndicator.tile === RIGHT_ARROW
                    ? { x: i, y: this.directionIndicator.coords.y }
                    : { x: this.directionIndicator.coords.x, y: i };
            if (!this.boardService.getTile(coord)) {
                this.directionIndicator.coords = coord;
                this.placeIndicator();
                return true;
            }
        }
        this.directionIndicator.coords = INVALID_COORDS;
        return false;
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
        for (const tile of this.tilesPlacedOnBoard) {
            this.boardService.board.delete(this.boardService.coordToKey(tile.coords));
        }
        //  Check if word has adjacent tiles
        let hasNeighbor = false;
        for (const tile of this.tilesPlacedOnBoard) {
            if (this.boardService.getTile({ x: tile.coords.x - 1, y: tile.coords.y })) hasNeighbor = true;
            if (this.boardService.getTile({ x: tile.coords.x + 1, y: tile.coords.y })) hasNeighbor = true;
            if (this.boardService.getTile({ x: tile.coords.x, y: tile.coords.y - 1 })) hasNeighbor = true;
            if (this.boardService.getTile({ x: tile.coords.x, y: tile.coords.y + 1 })) hasNeighbor = true;
        }
        for (const tile of this.tilesPlacedOnBoard) {
            this.boardService.placeTile(tile.coords, tile.tile);
        }
        return hasNeighbor;
    }

    getBoardTileFromMouse(mouseCoords: Vec2): Vec2 {
        const tileWidth = GRID_WIDTH / GRID_SIZE;
        const tileHeight = GRID_HEIGHT / GRID_SIZE;
        const x = (mouseCoords.x - (mouseCoords.x % tileWidth)) / tileWidth;
        const y = (mouseCoords.y - (mouseCoords.y % tileHeight)) / tileHeight;
        return { x, y };
    }
}
