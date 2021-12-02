import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication.service';
import { DEFAULT_VIRTUAL_PLAYER_NAMES } from '@common/constants';
import { Difficulty, PlayerName } from '@common/player-name';
import { from, Observable, of } from 'rxjs';
import { PlayerNamesPopupComponent } from './player-names-popup.component';
import SpyObj = jasmine.SpyObj;

export class CommunicationServiceMock {
    expertPlayers: PlayerName[] = [{ name: 'player', difficulty: Difficulty.Expert }];
    beginnerPlayers: PlayerName[] = [{ name: 'player', difficulty: Difficulty.Beginner }];

    getExpertPlayerNames(): Observable<PlayerName[]> {
        return from(new Promise<PlayerName[]>((resolve) => setTimeout(resolve, 2)).then(() => this.expertPlayers));
    }
    getBeginnerPlayerNames(): Observable<PlayerName[]> {
        return from(new Promise<PlayerName[]>((resolve) => setTimeout(resolve, 2)).then(() => this.beginnerPlayers));
    }
    modifyPlayerName(): Observable<boolean> {
        return from(new Promise<PlayerName[]>((resolve) => setTimeout(resolve, 2)).then(() => true));
    }
    deletePlayerName(): Observable<boolean> {
        return from(new Promise<PlayerName[]>((resolve) => setTimeout(resolve, 2)).then(() => true));
    }
    addPlayerName(): Observable<boolean> {
        return from(new Promise<PlayerName[]>((resolve) => setTimeout(resolve, 2)).then(() => true));
    }
}

describe('PlayerNamesPopupComponent', () => {
    let component: PlayerNamesPopupComponent;
    let fixture: ComponentFixture<PlayerNamesPopupComponent>;
    let dialogSpy: SpyObj<MatDialog>;
    let dialogRefSpy: SpyObj<MatDialogRef<PlayerNamesPopupComponent>>;

    beforeEach(() => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'close']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerNamesPopupComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: 'expert' },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: CommunicationService, useClass: CommunicationServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNamesPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dialogSpy.open.and.returnValue(dialogRefSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the names of expert players when the type is expert', async () => {
        const expertPlayer: PlayerName[] = [{ name: 'player', difficulty: Difficulty.Expert }];
        const spy = spyOn(component.communication, 'getExpertPlayerNames').and.returnValue(of(expertPlayer));
        component.difficulty = 'expert';
        component.getPlayerNames();
        expect(spy).toHaveBeenCalled();
        expect(component.playerNames.data).toEqual(expertPlayer);
    });

    it('should get the names of beginner players when the type is beginner', async () => {
        const beginnerPlayer: PlayerName[] = [{ name: 'player', difficulty: Difficulty.Beginner }];
        const spy = spyOn(component.communication, 'getBeginnerPlayerNames').and.returnValue(of(beginnerPlayer));
        component.difficulty = 'beginner';
        component.getPlayerNames();
        expect(spy).toHaveBeenCalled();
        expect(component.playerNames.data).toEqual(beginnerPlayer);
    });

    it('should close the dialog', () => {
        component.back();
        expect(component.dialogRef.close).toHaveBeenCalled();
    });

    it('should call the modifyPlayerName method from communication if the popup returns valid text', () => {
        dialogRefSpy.afterClosed.and.returnValue(of('newName'));
        spyOn(component, 'getPlayerNames').and.returnValue();
        const spy = spyOn(component.communication, 'modifyPlayerName').and.returnValue(of(true));
        component.editPlayerName({ name: 'player', difficulty: Difficulty.Beginner });
        expect(spy).toHaveBeenCalled();
    });

    it('should call the deletePlayerName method from communication if the popup returns true', () => {
        const player: PlayerName = { name: 'player', difficulty: Difficulty.Beginner };
        dialogRefSpy.afterClosed.and.returnValue(of(true));
        spyOn(component, 'getPlayerNames').and.returnValue();
        const spy = spyOn(component.communication, 'deletePlayerName').and.returnValue(of(true));
        component.deletePlayerName(player);
        expect(spy).toHaveBeenCalled();
    });

    it('should call the addPlayerName method from communication if the popup returns a valid name', () => {
        dialogRefSpy.afterClosed.and.returnValue(of('newPlayer'));
        spyOn(component, 'getPlayerNames').and.returnValue();
        const spy = spyOn(component.communication, 'addPlayerName').and.returnValue(of(true));
        component.addPlayer();
        expect(spy).toHaveBeenCalled();
    });

    it('should correctly determine wether or not a player name is default', () => {
        expect(component.isDefault(DEFAULT_VIRTUAL_PLAYER_NAMES[2])).toBeTrue();
    });

    it('should correctly determine wether or not a player name is default', () => {
        const randomPlayer: PlayerName = { name: 'notDefault', difficulty: Difficulty.Beginner };
        expect(component.isDefault(randomPlayer)).toBeFalse();
    });
});
