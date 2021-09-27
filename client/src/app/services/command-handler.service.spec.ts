import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { CommandHandlerService } from './command-handler.service';
import { GameManagerService } from './game-manager.service';

describe('CommandHandlerService', () => {
    let service: CommandHandlerService;
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;
    let tiles: Tile[];
    let player: Player;

    beforeEach(() => {
        gameManagerSpy = jasmine.createSpyObj<GameManagerService>('GameManagerService', ['exchangeTiles', 'placeTiles', 'skipTurn']);
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: GameManagerService, useValue: gameManagerSpy }],
        });
        service = TestBed.inject(CommandHandlerService);
        tiles = [
            { letter: 'a', points: 0 },
            { letter: 'b', points: 0 },
            { letter: 'c', points: 0 },
            { letter: 'd', points: 0 },
        ];
        player = {
            name: 'player',
            score: 0,
            easel: new Easel(tiles),
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the right functions when the command is valid', () => {
        const exchange = '!echanger abcdef';
        const place = '!placer a10v abcdef';
        const pass = '!passer';
        service.handleCommand(exchange, player);
        service.handleCommand(place, player);
        service.handleCommand(pass, player);
        expect(gameManagerSpy.exchangeTiles).toHaveBeenCalledTimes(1);
        expect(gameManagerSpy.placeTiles).toHaveBeenCalledTimes(1);
        expect(gameManagerSpy.skipTurn).toHaveBeenCalledTimes(1);
    });

    it('should call GameManager exchangeTiles when the command is valid', () => {
        const exchangeGood = '!echanger abcdef';
        const exchangeGoodStar = '!echanger abcde*';
        const exchangeBad = 'echanger q';
        service.exchange(exchangeGood, player);
        service.exchange(exchangeGoodStar, player);
        service.exchange(exchangeBad, player);
        expect(gameManagerSpy.exchangeTiles).toHaveBeenCalledTimes(2);
    });

    it('should call GameManager placeTiles when command is valid', () => {
        const placeGood = '!placer a10v abcdef';
        const placeCapital = '!placer c2h abcDef';
        const placeBad = '!placer p10h abcd';
        service.place(placeGood, player);
        service.place(placeCapital, player);
        service.place(placeBad, player);
        expect(gameManagerSpy.placeTiles).toHaveBeenCalledTimes(2);
    });

    it('should call GameManager skipTurn when command is valid', () => {
        const passGood = '!passer';
        const passBad = '!passer a';
        service.pass(passGood, player);
        service.pass(passBad, player);
        expect(gameManagerSpy.skipTurn).toHaveBeenCalledTimes(1);
    });

    it('should return an error message when the command is invalid', () => {
        const invalidCmdExchange = 'echanger abcccccas';
        expect(service.handleCommand(invalidCmdExchange, player).body).toBe("La commande entrée n'est pas valide");
    });
});
