import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Dictionary, GameMode } from '@app/classes/game-config';
import { VirtualPlayerLevelPopupComponent } from '@app/components/virtual-player-level-popup/virtual-player-level-popup.component';
import { DURATION_INIT, SECOND_MD } from '@app/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication.service';
import { of } from 'rxjs';
import { WaitingPopupComponent } from './waiting-popup.component';
import SpyObj = jasmine.SpyObj;

describe('WaitingPopupComponent', () => {
    let component: WaitingPopupComponent;
    let fixture: ComponentFixture<WaitingPopupComponent>;
    let communicationService: SpyObj<CommunicationService>;

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

    beforeEach(() => {
        communicationService = jasmine.createSpyObj('CommunicationService', ['leaveLobby']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, BrowserAnimationsModule, RouterTestingModule, AppMaterialModule],
            declarations: [WaitingPopupComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: { data: config } },
                { provide: CommunicationService, useValue: communicationService },
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

    it('should close popup if game started', fakeAsync(() => {
        const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
        component.communication.started = true;
        tick(SECOND_MD);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(spyClose).toHaveBeenCalled();
        });
    }));

    it('should switch mode', () => {
        const gameConfig = {
            playerName1: 'host',
            playerName2: 'guest',
            gameMode: GameMode.Classic,
            isMultiPlayer: false,
            duration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
        };
        const spyVirtualPlayerPopup = spyOn(component, 'openVirtualPlayerLevelPopup').and.returnValue({
            afterClosed: () => of(gameConfig),
        } as MatDialogRef<VirtualPlayerLevelPopupComponent>);
        component.switchMode();
        expect(spyVirtualPlayerPopup).toHaveBeenCalled();
    });

    it('should open virtual player level popup', () => {
        const spyOpen = spyOn(component.dialog, 'open').and.callThrough();
        component.openVirtualPlayerLevelPopup();
        fixture.detectChanges();
        expect(spyOpen).toBeTruthy();
    });

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
