import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAX_SKIP_COUNT } from '@app/constants';
import { GameManagerService } from '@app/services/game-manager.service';
import { PlayerService } from '@app/services/player.service';

import { PlayerInfoComponent } from './player-info.component';
import Spy = jasmine.Spy;

describe('PlayerInfoComponent', () => {
    let component: PlayerInfoComponent;
    let fixture: ComponentFixture<PlayerInfoComponent>;
    const gameManagerService = jasmine.createSpyObj(
        'GameManagerService',
        {
            ['skipTurn']: () => {
                // do nothing
            },
            ['reset']: () => {
                // do nothing
            },
            ['stopTimer']: () => {
                // do nothing
            },
        },
        {},
    );
    const playerService = jasmine.createSpyObj('PlayerService', {}, { ['skipCounter']: 1 });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerInfoComponent],
            providers: [
                { provide: GameManagerService, useValue: gameManagerService },
                { provide: PlayerService, useValue: playerService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#getTimer should return currentTurnDurationLeft', () => {
        expect(component.timer).toEqual(gameManagerService.currentTurnDurationLeft);
    });

    it('should call game manager skip turn function when turn skipped', () => {
        component.skipTurn();
        fixture.detectChanges();
        expect(gameManagerService.skipTurn).toHaveBeenCalled();
    });

    it('should call stop timer if turn skipped six times continuously', () => {
        (Object.getOwnPropertyDescriptor(playerService, 'skipCounter')?.get as Spy<() => number>).and.returnValue(MAX_SKIP_COUNT - 1);

        component.skipTurn();
        expect(playerService.skipCounter).toEqual(MAX_SKIP_COUNT - 1);
        expect(gameManagerService.stopTimer).toHaveBeenCalled();
    });

    it('should rest the game when player quit', () => {
        component.quit();
        fixture.detectChanges();
        expect(gameManagerService.reset).toHaveBeenCalled();
    });
});
