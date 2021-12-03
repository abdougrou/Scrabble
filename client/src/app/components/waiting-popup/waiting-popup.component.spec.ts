import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GameMode } from '@app/classes/game-config';
import { AppMaterialModule } from '@app/modules/material.module';
import { WaitingPopupComponent } from './waiting-popup.component';

describe('WaitingPopupComponent', () => {
    let component: WaitingPopupComponent;
    let fixture: ComponentFixture<WaitingPopupComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    const config = {
        key: '',
        host: '',
        turnDuration: 60,
        bonusEnabled: false,
        dictionary: 'francais',
        gameMode: GameMode.Classic,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, BrowserAnimationsModule, RouterTestingModule, AppMaterialModule],
            declarations: [WaitingPopupComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: { data: config } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close popup if game started', fakeAsync(() => {
        const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
        component.communication.started = true;
        tick();
        expect(spyClose).toHaveBeenCalled();
    }));

    it('should leave lobby', () => {
        const spyLeave = spyOn(component.communication, 'leaveLobby').and.callThrough();
        const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
        component.back();
        expect(spyLeave).toHaveBeenCalled();
        expect(spyClose).toHaveBeenCalled();
    });

    it('should starts game', () => {
        const spyRouter = spyOn(component.router, 'navigateByUrl').and.callThrough();
        const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
        component.startGame();
        expect(spyRouter).toHaveBeenCalled();
        expect(spyClose).toHaveBeenCalled();
    });
});
