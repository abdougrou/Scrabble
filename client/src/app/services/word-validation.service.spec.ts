import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TileCoords } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { BoardService } from './board.service';
import { WordValidationService } from './word-validation.service';

describe('WordValidationService', () => {
    let service: WordValidationService;
    let board: BoardService;
    let newTiles: TileCoords[];
    beforeEach(() => {
        board = new BoardService();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: BoardService, useValue: board }],
        });
        service = TestBed.inject(WordValidationService);
        TestBed.inject(HttpClient);
        service.dictionnary = ['word', 'test', 'hey'];
        newTiles = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should validate a correct word', () => {
        const word = 'hey';
        const initialCoord: Vec2 = { x: 3, y: 2 };
        for (let i = 0; i < word.length; i++) {
            board.placeTile({ x: initialCoord.x + i, y: initialCoord.y }, { letter: word.charAt(i), points: 0 });
            newTiles.push({ tile: { letter: word.charAt(i), points: 0 }, coords: { x: initialCoord.x + i, y: initialCoord.y } });
        }
        expect(service.validateWords(newTiles)).toBeTrue();
    });

    it('should not validate a word that isnt in the dictionnary', () => {
        const word = 'fake';
        const initialCoord: Vec2 = { x: 3, y: 2 };
        for (let i = 0; i < word.length; i++) {
            board.placeTile({ x: initialCoord.x + i, y: initialCoord.y }, { letter: word.charAt(i), points: 0 });
            newTiles.push({ tile: { letter: word.charAt(i), points: 0 }, coords: { x: initialCoord.x + i, y: initialCoord.y } });
        }
        expect(service.validateWords(newTiles)).toBeFalse();
    });

    it('should remove accents', () => {
        newTiles = [
            { tile: { letter: 't', points: 0 }, coords: { x: 2, y: 11 } },
            { tile: { letter: 'é', points: 2 }, coords: { x: 2, y: 12 } },
            { tile: { letter: 's', points: 2 }, coords: { x: 2, y: 13 } },
            { tile: { letter: 't', points: 0 }, coords: { x: 2, y: 14 } },
        ];
        for (const newTile of newTiles) {
            board.placeTile(newTile.coords, newTile.tile);
        }
        expect(service.validateWords(newTiles)).toBeTrue();
    });

    it('should return false for invalid letters', () => {
        service.dictionnary.push('hey-');
        const word = 'hey-';
        const initialCoord: Vec2 = { x: 3, y: 2 };
        for (let i = 0; i < word.length; i++) {
            board.placeTile({ x: initialCoord.x + i, y: initialCoord.y }, { letter: word.charAt(i), points: 0 });
            newTiles.push({ tile: { letter: word.charAt(i), points: 0 }, coords: { x: initialCoord.x + i, y: initialCoord.y } });
        }
        expect(service.validateWords(newTiles)).toBeFalse();
    });

    it('should return false if the player has placed a tile with no adjacent tiles', () => {
        service.dictionnary.push('b');
        newTiles = [
            { tile: { letter: 'h', points: 0 }, coords: { x: 1, y: 2 } },
            { tile: { letter: 'e', points: 2 }, coords: { x: 2, y: 2 } },
            { tile: { letter: 'y', points: 2 }, coords: { x: 3, y: 2 } },
            { tile: { letter: 'b', points: 2 }, coords: { x: 10, y: 10 } },
        ];
        for (const tile of newTiles) {
            board.placeTile(tile.coords, tile.tile);
        }
        expect(service.validateWords(newTiles)).toBeFalse();
    });

    it('should validate a word made up of old and new tiles', () => {
        newTiles = [
            { tile: { letter: 'h', points: 4 }, coords: { x: 11, y: 2 } },
            { tile: { letter: 'e', points: 2 }, coords: { x: 12, y: 2 } },
        ];
        for (const tile of newTiles) {
            board.placeTile(tile.coords, tile.tile);
        }
        board.placeTile({ x: 13, y: 2 }, { letter: 'y', points: 4 });
        expect(service.validateWords(newTiles)).toBeTrue();
    });
    it('should only validate a word created after adding the new tiles', () => {
        newTiles = [
            { tile: { letter: 'h', points: 4 }, coords: { x: 12, y: 2 } },
            { tile: { letter: 'e', points: 2 }, coords: { x: 13, y: 2 } },
            { tile: { letter: 'y', points: 2 }, coords: { x: 14, y: 2 } },
        ];
        for (const tile of newTiles) {
            board.placeTile(tile.coords, tile.tile);
        }
        board.placeTile({ x: 1, y: 2 }, { letter: 'y', points: 4 });
        board.placeTile({ x: 2, y: 2 }, { letter: 'y', points: 4 });
        expect(service.validateWords(newTiles)).toBeTrue();
    });
    it('should validate horizontal and vertical words', () => {
        newTiles = [
            { tile: { letter: 'h', points: 4 }, coords: { x: 6, y: 7 } },
            { tile: { letter: 'e', points: 2 }, coords: { x: 7, y: 7 } },
            { tile: { letter: 'y', points: 2 }, coords: { x: 8, y: 7 } },
            { tile: { letter: 't', points: 4 }, coords: { x: 7, y: 6 } },
            { tile: { letter: 's', points: 2 }, coords: { x: 7, y: 8 } },
            { tile: { letter: 't', points: 2 }, coords: { x: 7, y: 9 } },
        ];
        for (const tile of newTiles) {
            board.placeTile(tile.coords, tile.tile);
        }
        expect(service.validateWords(newTiles)).toBeTrue();
    });
});
