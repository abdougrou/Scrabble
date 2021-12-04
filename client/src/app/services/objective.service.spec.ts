import { TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { formPalindrome, placeLetterX } from '@app/classes/objective';
import { Player } from '@app/classes/player';
import { Move } from '@common/move';
import { ObjectiveService } from './objective.service';

describe('ObjectiveService', () => {
    let service: ObjectiveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ObjectiveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create exactly 4 objectives when we initialize', () => {
        service.initialize();
        const OBJ_LENGTH = 4;
        expect(service.objectives.length).toEqual(OBJ_LENGTH);
    });
    it('should properly assign an objective to a player', () => {
        const playerName = 'player';
        service.initialize();
        service.assignObjective(playerName);
        expect(service.objectives.pop()?.playerName).toEqual(playerName);
    });
    it('should give the player points if he achieves an objective', () => {
        const player: Player = { name: 'player', easel: new Easel(), score: 0, debug: false };
        const move: Move = { word: 'laval', coord: { x: 5, y: 5 }, across: true, points: 2, formedWords: 1 };
        service.objectives = [];
        service.objectives.push(formPalindrome);
        service.assignObjective(player.name);
        expect(service.check(player, move)).toEqual(true);
        expect(player.score).toEqual(formPalindrome.reward);

        // Should not validate an objective which has been completed
        service.assignObjective(player.name);
        expect(service.check(player, move)).toEqual(false);
    });
    it('should give the player points if he does not achieve an objective', () => {
        const player: Player = { name: 'player', easel: new Easel(), score: 0, debug: false };
        const move: Move = { word: 'notpalindrome', coord: { x: 5, y: 5 }, across: true, points: 2, formedWords: 1 };
        service.objectives = [];
        service.objectives.push(placeLetterX);
        service.assignObjective(player.name);
        expect(service.check(player, move, ['a'])).toEqual(false);
    });
});
