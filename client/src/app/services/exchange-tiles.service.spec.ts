import { TestBed } from '@angular/core/testing';
import { ExchangeTilesService } from './exchange-tiles.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

describe('ExchangeTilesService', () => {
    let service: ExchangeTilesService;
    let players: PlayerService;
    let reserve: ReserveService;

    beforeEach(() => {
        players = new PlayerService();
        reserve = new ReserveService();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: PlayerService, useValue: players },
                { provide: ReserveService, useValue: reserve },
            ],
        });
        service = TestBed.inject(ExchangeTilesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not exchange a players tiles if its not his turn', () => {
        const message = "Ce n'est pas votre tour";
        players.createPlayer('player1', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        players.createPlayer('player2', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        expect(service.exchangeLetters(['a'], players.getPlayerByName('player2')).body).toEqual(message);
    });

    it('should not exchange tiles if the reserve has less tiles than necessary', () => {
        const message = "Il n'y a pas assez de tuiles dans la réserve";
        spyOn(service.reserve, 'isExchangePossible').and.returnValue(false);
        players.createPlayer('player1', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        players.createPlayer('player2', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        expect(service.exchangeLetters(['a'], players.getPlayerByName('player1')).body).toEqual(message);
    });

    it('should not exchange tiles if the players easel doesnt contain the tiles to exchange', () => {
        const message = 'Votre chevalet ne contient pas les lettres nécessaires';
        players.createPlayer('player1', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        players.createPlayer('player2', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        expect(service.exchangeLetters(['z'], players.getPlayerByName('player1')).body).toEqual(message);
    });

    it('should exchange the tiles when all the criterias are met', () => {
        players.createPlayer('player1', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        players.createPlayer('player2', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        expect(service.exchangeLetters(['a'], players.getPlayerByName('player1')).body).toEqual('');
    });
});
