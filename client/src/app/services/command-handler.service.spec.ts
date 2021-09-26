import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { COMMAND_RESULT } from '@app/constants';
import { CommandHandlerService } from './command-handler.service';
import { GameManagerService } from './game-manager.service';

describe('CommandHandlerService', () => {
    let commandHandler: CommandHandlerService;
    let tiles: Tile[];
    let player: Player;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: GameManagerService }],
        });
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

    // it('different command case exchange', () => {
    //     const exchangeGood = '!exchange abcde*';
    //     const exchangeGoodStar = '!exchange abcdef';
    //     const exchangeWrong = 'exchange q';
    //     expect(commandHandler.exchange(exchangeGood, player)).toEqual(true);
    //     expect(commandHandler.exchange(exchangeGoodStar, player)).toEqual(true);
    //     expect(commandHandler.exchange(exchangeWrong, player)).toEqual(false);
    // });

    it('different command case place', () => {
        const placeGood = '!placer a10v uwu';
        // const placeCapital = '!placer c2h uWu';
        // const placeWrong = '!placer p10h UwUuWu';
        const verticale = 'verticale';
        // const horizontale = 'horizontale';
        const coordGood = 'a10v';
        // const coordCapital = 'c2h';
        // const coordWrong = 'p10h';
        expect(commandHandler.place(placeGood, player)).toEqual({
            user: COMMAND_RESULT,
            body: `${player.name} a placé le mot : (${placeGood.split(' ')[2]}) dans la direction ${verticale} à la case ${coordGood}`,
        });
        // expect(commandHandler.place(placeCapital, player)).toEqual(true);
        // expect(commandHandler.place(placeWrong, player)).toEqual(false);
    });
});
