import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication.service';
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
}

describe('PlayerNamesPopupComponent', () => {
    let component: PlayerNamesPopupComponent;
    let fixture: ComponentFixture<PlayerNamesPopupComponent>;
    let dialogSpy: SpyObj<MatDialog>;
    let dialogRefSpy: SpyObj<MatDialogRef<PlayerNamesPopupComponent>>;

    beforeEach(() => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the names of expert players when the type is expert', async () => {
        const expertPlayer: PlayerName[] = [{ name: 'player', difficulty: Difficulty.Expert }];
        const spy = spyOn(component.communication, 'getExpertPlayerNames').and.returnValue(of());
        component.playerType = 'expert';
        component.getPlayerNames();
        expect(spy).toHaveBeenCalled();
        expect(component.playerNames.data).toEqual(expertPlayer);
    });

    it('should get the names of beginner players when the type is beginner', async () => {
        const beginnerPlayer: PlayerName[] = [{ name: 'player', difficulty: Difficulty.Beginner }];
        const spy = spyOn(component.communication, 'getExpertPlayerNames').and.returnValue(of());
        component.playerType = 'beginner';
        component.getPlayerNames();
        expect(spy).toHaveBeenCalled();
        expect(component.playerNames.data).toEqual(beginnerPlayer);
    });

    it('should close the dialog', () => {
        component.back();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should open a dialog', () => {
        const player: PlayerName = { name: 'player', difficulty: Difficulty.Beginner };
        component.editPlayerName(player);
        expect(dialogSpy.open).toHaveBeenCalled();
    });
});
