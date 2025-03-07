import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { CommandHandlerService } from './command-handler.service';
import { GameManagerService } from './game-manager.service';

describe('CommandHandlerService', () => {
    let service: CommandHandlerService;
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;
    let letters: string[];
    let player: Player;

    beforeEach(() => {
        gameManagerSpy = jasmine.createSpyObj<GameManagerService>('GameManagerService', [
            'exchangeLetters',
            'placeLetters',
            'skipTurn',
            'activateDebug',
        ]);
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: GameManagerService, useValue: gameManagerSpy }],
        });
        service = TestBed.inject(CommandHandlerService);
        letters = ['a', 'b', 'c', 'd'];
        player = {
            name: 'player',
            score: 0,
            easel: new Easel(letters),
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the right functions when the command is valid', () => {
        const exchange = '!échanger abcdef';
        const place = '!placer a10v abcdef';
        const pass = '!passer';
        const debug = '!debug';
        service.handleCommand(exchange, player);
        service.handleCommand(place, player);
        service.handleCommand(pass, player);
        service.handleCommand(debug, player);
        expect(gameManagerSpy.exchangeLetters).toHaveBeenCalledTimes(1);
        expect(gameManagerSpy.placeLetters).toHaveBeenCalledTimes(1);
        expect(gameManagerSpy.skipTurn).toHaveBeenCalledTimes(1);
        expect(gameManagerSpy.activateDebug).toHaveBeenCalledTimes(1);
    });

    it('should call GameManager exchangeTiles when the command is valid', () => {
        const exchangeGood = '!échanger abcdef';
        const exchangeGoodStar = '!échanger abcde*';
        const exchangeBad = 'échanger q';
        service.exchange(exchangeGood, player);
        service.exchange(exchangeGoodStar, player);
        service.exchange(exchangeBad, player);
        expect(gameManagerSpy.exchangeLetters).toHaveBeenCalledTimes(2);
    });

    it('should call GameManager placeTiles when command is valid', () => {
        const placeGood = '!placer a10v abcdef';
        const placeCapital = '!placer c2h abcDef';
        const placeBad = '!placer p10h abcd';
        service.place(placeGood, player);
        service.place(placeCapital, player);
        service.place(placeBad, player);
        expect(gameManagerSpy.placeLetters).toHaveBeenCalledTimes(2);
    });

    it('should call GameManager skipTurn when command is valid', () => {
        const passGood = '!passer';
        const passBad = '!passer a';
        service.pass(passGood, player);
        service.pass(passBad, player);
        expect(gameManagerSpy.skipTurn).toHaveBeenCalledTimes(1);
    });

    it('should call GameManager activateDebug when command is valid', () => {
        const debugGood = '!debug';
        const debugBad = '!debug la';
        service.debug(debugGood);
        service.debug(debugBad);
        expect(gameManagerSpy.activateDebug).toHaveBeenCalledTimes(1);
    });

    it('should return an error message when the command is invalid', () => {
        const invalidCmdExchange = 'échanger abcccccas';
        expect(service.handleCommand(invalidCmdExchange, player).body).toBe("La commande entrée n'est pas valide");
    });
});
