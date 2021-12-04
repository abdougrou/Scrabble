import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DURATION_INIT } from '@app/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication.service';
import { GameMode, LobbyConfig } from '@common/lobby-config';
import { from, Observable, of } from 'rxjs';
import { MultiplayerRoomsComponent } from './multiplayer-rooms.component';
import SpyObj = jasmine.SpyObj;

export class CommunicationServiceMock {
    lobbies: LobbyConfig[] = [{ host: 'name', turnDuration: DURATION_INIT, bonusEnabled: false, dictionary: 'francais', gameMode: GameMode.Classic }];
    getLobbies(): Observable<LobbyConfig[]> {
        return from(new Promise<LobbyConfig[]>((resolve) => setTimeout(resolve, 2)).then(() => this.lobbies));
    }
}

describe('MultiplayerRoomsComponent', () => {
    let component: MultiplayerRoomsComponent;
    let fixture: ComponentFixture<MultiplayerRoomsComponent>;
    let snackbarSpy: SpyObj<MatSnackBar>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(() => {
        snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, BrowserAnimationsModule, AppMaterialModule, RouterTestingModule],
            declarations: [MultiplayerRoomsComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: CommunicationService, useClass: CommunicationServiceMock },
                { provide: MatSnackBar, useValue: snackbarSpy },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { mode: GameMode.Classic } },
                FormBuilder,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerRoomsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('create lobby should open form popup', async () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        fixture.detectChanges();
        // spyOn(component, 'openFormPopup').and.returnValue(Promise.resolve(true));
        spyOn(component, 'openFormPopup').and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<typeof component>);
        component.createLobby();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it('join lobby should open join form popup', async () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.lobbies = [
            { key: 'abcd', host: 'name', turnDuration: DURATION_INIT, bonusEnabled: false, dictionary: 'francais', gameMode: GameMode.Classic },
        ];
        fixture.detectChanges();
        spyOn(component, 'openJoinPopup').and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<typeof component>);
        component.joinLobby('abcd');
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it('join lobby should open snack bar error', async () => {
        const spy = spyOn(component.snackBar, 'open').and.callThrough();
        component.lobbies = [
            { key: 'keyA', host: 'name', turnDuration: DURATION_INIT, bonusEnabled: false, dictionary: 'francais', gameMode: GameMode.Classic },
        ];
        fixture.detectChanges();
        component.joinLobby('keyB');
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it('should refresh lobbies list after creating lobby', () => {
        const spy = spyOn(component, 'getLobbies').and.callThrough();
        component.createLobby();
        fixture.detectChanges();
        expect(spy).toBeTruthy();
    });

    it('should open form popup', () => {
        const spy = spyOn(component.dialog, 'open').and.callThrough();
        component.openFormPopup();
        fixture.detectChanges();
        expect(spy).toBeTruthy();
    });

    it('should refreh lobbies', () => {
        const spy = spyOn(component.communication, 'getLobbies').and.callThrough();
        component.getLobbies();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it('should join random lobby', () => {
        component.lobbies = [
            { key: 'keyA', host: 'name', turnDuration: DURATION_INIT, bonusEnabled: false, dictionary: 'francais', gameMode: GameMode.Classic },
            { key: 'keyB', host: 'name', turnDuration: DURATION_INIT, bonusEnabled: false, dictionary: 'francais', gameMode: GameMode.Classic },
            { key: 'keyC', host: 'name', turnDuration: DURATION_INIT, bonusEnabled: false, dictionary: 'francais', gameMode: GameMode.Classic },
            { key: 'keyD', host: 'name', turnDuration: DURATION_INIT, bonusEnabled: false, dictionary: 'francais', gameMode: GameMode.Classic },
        ];
        const spyJoin = spyOn(component, 'joinLobby').and.callThrough();
        component.joinRandomLobby();
        fixture.detectChanges();
        expect(spyJoin).toHaveBeenCalled();
    });

    it('should open join form popup', () => {
        const spyJoin = spyOn(component.dialog, 'open').and.callThrough();
        const key = 'key';
        component.openJoinPopup(key);
        fixture.detectChanges();
        expect(spyJoin).toHaveBeenCalled();
    });
});
