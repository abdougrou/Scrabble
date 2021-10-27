import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAX_SKIP_COUNT } from '@app/constants';
import { GameManagerService } from '@app/services/game-manager.service';
import { GridService } from '@app/services/grid.service';
import { PlayerService } from '@app/services/player.service';
import { PlayerInfoComponent } from './player-info.component';
import SpyObj = jasmine.SpyObj;

describe('PlayerInfoComponent', () => {
    let component: PlayerInfoComponent;
    let fixture: ComponentFixture<PlayerInfoComponent>;
    let gameManagerService: SpyObj<GameManagerService>;
    let gridService: SpyObj<GridService>;
    let playerService: PlayerService;

    beforeEach(() => {
        playerService = new PlayerService();
        playerService.createPlayer('player', []);
        playerService.createPlayer('playerTwo', []);
        gameManagerService = jasmine.createSpyObj('GameManagerService', ['buttonSkipTurn', 'reset', 'stopTimer', 'endGame']);
        gridService = jasmine.createSpyObj('GrideService', ['clearBoard', 'drawBoard']);
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [PlayerInfoComponent],
            providers: [
                { provide: GameManagerService, useValue: gameManagerService },
                { provide: PlayerService, useValue: playerService },
                { provide: GridService, useValue: gridService },
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

    it('should have winner', () => {
        playerService.players[0].score = 0;
        playerService.players[1].score = 10;

        expect(component.winner).toEqual(playerService.players[1].name);

        playerService.players[0].score = 10;
        playerService.players[1].score = 0;

        expect(component.winner).toEqual(playerService.players[0].name);
    });

    it('should increase font', () => {
        const oldSize = component.fontSize;
        component.increaseFont();
        expect(component.fontSize).toEqual(oldSize + 1);
        expect(gridService.clearBoard).toHaveBeenCalled();
        expect(gridService.drawBoard).toHaveBeenCalled();
        component.fontSize = 3;
        component.increaseFont();
        expect(component.fontSize).toEqual(3);
    });

    it('should decrease font', () => {
        component.fontSize = 1;
        component.decreaseFont();
        expect(component.fontSize).toEqual(0);
        expect(gridService.clearBoard).toHaveBeenCalled();
        expect(gridService.drawBoard).toHaveBeenCalled();
        component.fontSize = -1;
        component.decreaseFont();
        const size = -1;
        expect(component.fontSize).toEqual(size);
    });

    it('#getTimer should return currentTurnDurationLeft', () => {
        expect(component.timer).toEqual(gameManagerService.currentTurnDurationLeft);
    });

    it('should call game manager skip turn function when turn skipped', () => {
        component.skipTurn();
        fixture.detectChanges();
        expect(gameManagerService.buttonSkipTurn).toHaveBeenCalled();
    });

    it('should end game', () => {
        component.endGame();
        fixture.detectChanges();
        expect(gameManagerService.endGame).toHaveBeenCalled();
    });

    it('should call stop timer if turn skipped six times continuously', () => {
        playerService.skipCounter = MAX_SKIP_COUNT - 1;
        gameManagerService.buttonSkipTurn.and.callFake(() => {
            playerService.skipCounter++;
            if (playerService.skipCounter >= MAX_SKIP_COUNT) gameManagerService.stopTimer();
        });
        component.skipTurn();
        expect(gameManagerService.buttonSkipTurn).toHaveBeenCalled();
        expect(playerService.skipCounter).toEqual(MAX_SKIP_COUNT);
        expect(gameManagerService.stopTimer).toHaveBeenCalled();
    });

    it('should reset the game when player quit', () => {
        component.quit();
        fixture.detectChanges();
        expect(gameManagerService.reset).toHaveBeenCalled();
    });
});
