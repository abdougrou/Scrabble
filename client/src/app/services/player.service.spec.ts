import { TestBed } from '@angular/core/testing';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
    let service: PlayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlayerService);

        const tiles: Tile[] = [
            { letter: 'A', points: 0 },
            { letter: 'B', points: 0 },
            { letter: 'C', points: 0 },
            { letter: 'D', points: 0 },
        ];
        service.createPlayer('player1', tiles);
        service.createPlayer('player2', tiles);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('switchPlayers should switch players', () => {
        const player1: Player = service.current;
        const player2: Player = service.players[1];
        expect(service.players[0]).toEqual(player1);
        expect(service.players[1]).toEqual(player2);
        service.switchPlayers();
        expect(service.players[0]).toEqual(player2);
        expect(service.players[1]).toEqual(player1);
    });

    it('clear should clear players', () => {
        service.clear();
        expect(service.players[0]).toBeFalsy();
        expect(service.players[1]).toBeFalsy();
    });
});
