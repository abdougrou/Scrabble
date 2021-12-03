import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DURATION_INIT } from '@app/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { Dictionary, GameMode } from '@common/lobby-config';
import { VirtualPlayerLevelPopupComponent } from './virtual-player-level-popup.component';

describe('VirtualPlayerLevelPopupComponent', () => {
    let component: VirtualPlayerLevelPopupComponent;
    let fixture: ComponentFixture<VirtualPlayerLevelPopupComponent>;

    const gameConfig = {
        playerName1: 'host',
        playerName2: 'guest',
        gameMode: GameMode.Classic,
        isMultiPlayer: false,
        duration: DURATION_INIT,
        bonusEnabled: false,
        dictionary: Dictionary.French,
    };

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule, AppMaterialModule],
            declarations: [VirtualPlayerLevelPopupComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { config: gameConfig } },
                { provide: MatDialogRef, useValue: dialogMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtualPlayerLevelPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set beginner as level', () => {
        component.beginner();
        expect(component.data.config.expert).toEqual(false);
    });

    it('should set expert as level', () => {
        component.expert();
        expect(component.data.config.expert).toEqual(true);
    });

    it('should close the popup (beginner)', () => {
        const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
        component.beginner();
        expect(spyClose).toHaveBeenCalled();
    });

    it('should close the popup (expert)', () => {
        const spyClose = spyOn(component.dialogRef, 'close').and.callThrough();
        component.expert();
        expect(spyClose).toHaveBeenCalled();
    });
});
