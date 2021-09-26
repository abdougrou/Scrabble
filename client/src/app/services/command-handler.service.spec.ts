import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { CommandHandlerService } from './command-handler.service';

describe('CommandHandlerService', () => {
    let commandHandler: CommandHandlerService;
    let tiles: Tile[];
    let player: Player;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        commandHandler = TestBed.inject(CommandHandlerService);
        tiles = [
            { letter: 'A', points: 0 },
            { letter: 'B', points: 0 },
            { letter: 'C', points: 0 },
            { letter: 'D', points: 0 },
        ];
        player = {
            name: 'player',
            score: 0,
            easel: new Easel(tiles),
        };
    });

    it('should be created', () => {
        expect(commandHandler).toBeTruthy();
    });

    it('different command case exchange', () => {
        const exchangeGood = '!exchange abcde*';
        const exchangeGoodStar = '!exchange abcdef';
        const exchangeWrong = 'exchange q';
        expect(commandHandler.exchange(exchangeGood, player)).toBe(true);
        expect(commandHandler.exchange(exchangeGoodStar, player)).toBe(true);
        expect(commandHandler.exchange(exchangeWrong, player)).toBe(false);
    });

    it('different command case place', () => {
        const placeGood = '!place a10v uwu';
        const placeCapital = '!place c2h uWu';
        const placeWrong = '!place p10h UwUuWu';
        expect(commandHandler.place(placeGood, player)).toBe(true);
        expect(commandHandler.place(placeCapital, player)).toBe(true);
        expect(commandHandler.place(placeWrong, player)).toBe(false);
    });

    it('getCoordinateFromString works as expected', () => {
        const coordStr1 = 'a1';
        const coordStr2 = 'o15v';
        const coordStr3 = 'z2';
        const coordVec1: Vec2 = { x: 0, y: 0 };
        const coordVec2: Vec2 = { x: 14, y: 14 };
        const coordVec3: Vec2 = { x: 25, y: 1 };
        expect(commandHandler.getCoordinateFromString(coordStr1)).toEqual(coordVec1);
        expect(commandHandler.getCoordinateFromString(coordStr2)).toEqual(coordVec2);
        expect(commandHandler.getCoordinateFromString(coordStr3)).toEqual(coordVec3);
    });

    it('command should call the appropriate function', () => {
        const placeCommand = '!place a1v hello';
        const placeCommand1 = '!place c13h good';
        const exchangeCommand = '!exchange abc';
        const wrongCommand = 'exchange aaa';
        expect(commandHandler.handleCommand(placeCommand, player)).toBe(true);
        expect(commandHandler.handleCommand(placeCommand1, player)).toBe(true);
        expect(commandHandler.handleCommand(exchangeCommand, player)).toBe(true);
        expect(commandHandler.handleCommand(wrongCommand, player)).toBe(false);
    });
});
