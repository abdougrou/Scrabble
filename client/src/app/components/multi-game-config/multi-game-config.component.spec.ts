import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameMode } from '@common/lobby-config';
import { MultiGameConfigComponent } from './multi-game-config.component';

describe('MultiGameConfigComponent', () => {
    let component: MultiGameConfigComponent;
    let fixture: ComponentFixture<MultiGameConfigComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, BrowserAnimationsModule, RouterTestingModule, AppMaterialModule],
            declarations: [MultiGameConfigComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogMock }, { provide: MAT_DIALOG_DATA, useValue: {} }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiGameConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Creating lobby should send game config to server', () => {
        const spy = spyOn(component.communication, 'setConfig').and.callThrough();
        component.data.config = { host: '', key: '', dictionary: '', bonusEnabled: false, turnDuration: 60, gameMode: GameMode.Classic };
        component.createLobby();
        expect(spy).toHaveBeenCalled();
    });

    it('Creating lobby should open waiting popup', () => {
        const spy = spyOn(component, 'openWaitingPopup').and.callThrough();
        component.data.config = { host: '', key: '', dictionary: '', bonusEnabled: false, turnDuration: 60, gameMode: GameMode.Classic };
        component.createLobby();
        expect(spy).toHaveBeenCalled();
    });

    it('should be closed when waiting popup is closed', () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.data.config = { host: '', key: '', dictionary: '', bonusEnabled: false, turnDuration: 60, gameMode: GameMode.Classic };
        component.createLobby();
        component.dialog.closeAll();
        expect(spy).toHaveBeenCalled();
    });

    it('should open waiting popup', () => {
        const spy = spyOn(component.dialog, 'open').and.callThrough();

        component.openWaitingPopup();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
        component.dialog.closeAll();
    });

    it('back button should close popup ', () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();

        component.back();
        expect(spy).toHaveBeenCalled();
    });
});
