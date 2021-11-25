import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameMode } from '@common/lobby-config';
import { MultiplayerJoinFormComponent } from './multiplayer-join-form.component';

describe('MultiplayerJoinFormComponent', () => {
    let component: MultiplayerJoinFormComponent;
    let fixture: ComponentFixture<MultiplayerJoinFormComponent>;

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

    const message = {
        key: '',
        host: '',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, BrowserAnimationsModule, AppMaterialModule, ReactiveFormsModule],
            declarations: [MultiplayerJoinFormComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogMock }, { provide: MAT_DIALOG_DATA, useValue: { config, message } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerJoinFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close popup when started equals true', () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.communication.started = true;
        expect(spy).toHaveBeenCalled();
    });

    it('should join lobby', () => {
        const spyJoinLobby = spyOn(component.communication, 'joinLobby').and.callThrough();
        const spySetConfig = spyOn(component.communication, 'setConfig').and.callThrough();
        component.joinLobby();
        expect(spyJoinLobby).toHaveBeenCalled();
        expect(spySetConfig).toHaveBeenCalled();
    });

    it('should close popup when back button clicked', () => {
        const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
        component.back();
        expect(spyClose).toHaveBeenCalled();
    });
});
