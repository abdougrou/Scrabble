// import { HttpClientModule } from '@angular/common/http';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';
// import { MatDialogModule } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { MAX_SKIP_COUNT } from '@app/constants';
// import { AppMaterialModule } from '@app/modules/material.module';
// import { GameManagerService } from '@app/services/game-manager.service';
// import { GridService } from '@app/services/grid.service';
// import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';
// import { PlayerService } from '@app/services/player.service';
// import { ReserveService } from '@app/services/reserve.service';
// import { PlayerInfoComponent } from './player-info.component';
// import SpyObj = jasmine.SpyObj;

// describe('PlayerInfoComponent', () => {
//     let component: PlayerInfoComponent;
//     let fixture: ComponentFixture<PlayerInfoComponent>;
//     let gameManagerService: SpyObj<GameManagerService>;
//     let multiplayerGameManagerService: SpyObj<MultiplayerGameManagerService>;
//     let gridService: SpyObj<GridService>;
//     let playerService: PlayerService;
//     let reserveService: ReserveService;

//     beforeEach(() => {
//         playerService = new PlayerService();
//         reserveService = new ReserveService();
//         playerService.createPlayer('player', ['a', 'b']);
//         playerService.createPlayer('playerTwo', ['c', 'd']);
//         gameManagerService = jasmine.createSpyObj('GameManagerService', ['buttonSkipTurn', 'reset', 'stopTimer', 'endGame']);
//         multiplayerGameManagerService = jasmine.createSpyObj('MultiplayerGameManagerService', ['getMainPlayer', 'reset', 'skipTurn', 'endGame']);
//         gridService = jasmine.createSpyObj('GridService', ['clearBoard', 'drawBoard']);
//     });
//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [HttpClientModule, MatDialogModule, RouterTestingModule, MatCardModule, AppMaterialModule],
//             declarations: [PlayerInfoComponent],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA],
//             providers: [
//                 { provide: PlayerService, useValue: playerService },
//                 { provide: GameManagerService, useValue: gameManagerService },
//                 { provide: MultiplayerGameManagerService, useValue: multiplayerGameManagerService },
//                 { provide: ReserveService, useValue: reserveService },
//                 { provide: Router, useValue: { url: '/game' } },
//                 { provide: GridService, useValue: gridService },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PlayerInfoComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should have winner', () => {
//         playerService.players[0].score = 0;
//         playerService.players[1].score = 10;
//         component.players = playerService.players;

//         expect(component.winner).toEqual(playerService.players[1].name);

//         // playerService.players[0].score = 10;
//         // playerService.players[1].score = 0;

//         // expect(component.winner).toEqual(playerService.players[0].name);
//     });

//     it('should reserveCount equal reserveService size', () => {
//         expect(component.reserveCount).toEqual(reserveService.size);
//     });

//     it('should increase font', () => {
//         const oldSize = component.fontSize;
//         component.increaseFont();
//         expect(component.fontSize).toEqual(oldSize + 1);
//         expect(gridService.clearBoard).toHaveBeenCalled();
//         expect(gridService.drawBoard).toHaveBeenCalled();
//         component.fontSize = 3;
//         component.increaseFont();
//         expect(component.fontSize).toEqual(3);
//     });

//     it('should decrease font', () => {
//         component.fontSize = 1;
//         component.decreaseFont();
//         expect(component.fontSize).toEqual(0);
//         expect(gridService.clearBoard).toHaveBeenCalled();
//         expect(gridService.drawBoard).toHaveBeenCalled();
//         component.fontSize = -1;
//         component.decreaseFont();
//         const size = -1;
//         expect(component.fontSize).toEqual(size);
//     });

//     // it('#getTimer should return currentTurnDurationLeft', () => {
//     //     expect(component.timer).toEqual(gameManagerService.currentTurnDurationLeft);
//     // });

//     it('should call game manager skip turn function when turn skipped', () => {
//         component.skipTurn();
//         fixture.detectChanges();
//         expect(gameManagerService.buttonSkipTurn).toHaveBeenCalled();
//     });

//     it('should end game', () => {
//         component.endGame();
//         fixture.detectChanges();
//         expect(gameManagerService.endGame).toHaveBeenCalled();
//     });

//     it('should call stop timer if turn skipped six times continuously', () => {
//         playerService.skipCounter = MAX_SKIP_COUNT - 1;
//         gameManagerService.buttonSkipTurn.and.callFake(() => {
//             playerService.skipCounter++;
//             if (playerService.skipCounter >= MAX_SKIP_COUNT) gameManagerService.stopTimer();
//         });
//         component.skipTurn();
//         expect(gameManagerService.buttonSkipTurn).toHaveBeenCalled();
//         expect(playerService.skipCounter).toEqual(MAX_SKIP_COUNT);
//         expect(gameManagerService.stopTimer).toHaveBeenCalled();
//     });

//     it('should reset the game when player quit', () => {
//         component.quit();
//         fixture.detectChanges();
//         expect(gameManagerService.reset).toHaveBeenCalled();
//     });
// });
