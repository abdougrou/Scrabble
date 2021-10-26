import { Injectable } from '@angular/core';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { GRID_HEIGHT, GRID_SIZE, GRID_WIDTH } from '@app/constants';
import { BoardService } from './board.service';
import { GridService } from './grid.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceTilesService {
    startingTile: Vec2;
    vertical: boolean = true;
    hasPlacedTiles: boolean = false;
    placedTiles: Tile[] = [];
    constructor(private gridService: GridService, private boardService: BoardService, private playerService: PlayerService) {}

    manageClick(mouseCoords: Vec2) {
        const tileCoord: Vec2 = this.getBoardTileFromMouse(mouseCoords);
        if (!this.hasPlacedTiles) {
            if(this.startingTile){
                if (this.startingTile.x === tileCoord.x && this.startingTile.y === tileCoord.y) {
                    this.vertical = !this.vertical;
                }
            }
            
            if (this.boardService.board.get(this.boardService.coordToKey(tileCoord)) === undefined) {
                this.startingTile = tileCoord;
            }
        }
        if (this.vertical) window.alert('ver');
        else window.alert('hor');
    }

    manageKeyboard(key: string) {
        let newLetter = '';
        if (key === key.toUpperCase()) {
            newLetter = key.toLowerCase();
            key = '*';
        }
        if (this.playerService.mainPlayer.easel.containsTiles(key)) {
            if (this.startingTile) {
                this.hasPlacedTiles = true;
                const tile: Tile = this.playerService.mainPlayer.easel.getTiles(key)[0];
                if (tile.letter === '*') tile.letter = newLetter;
                this.boardService.placeTile(this.startingTile, tile);
                this.placedTiles.push(tile);
                this.gridService.drawBoard();
                this.startingTile = this.vertical
                    ? { x: this.startingTile.x, y: this.startingTile.y + 1 }
                    : { x: this.startingTile.x + 1, y: this.startingTile.y };
            }
        }
    }

    getBoardTileFromMouse(mouseCoords: Vec2): Vec2 {
        const tileWidth = GRID_WIDTH / GRID_SIZE;
        const tileHeight = GRID_HEIGHT / GRID_SIZE;
        const x = (mouseCoords.x - (mouseCoords.x % tileWidth)) / tileWidth;
        const y = (mouseCoords.y - (mouseCoords.y % tileHeight)) / tileHeight;
        return { x, y };
    }
}
