import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionary, GameConfig } from '@app/classes/game-config';
import { DURATION_INIT } from '@app/constants';
import { GameConfigPageComponent } from './game-config-page.component';

describe('GameConfigPageComponent', () => {
    let component: GameConfigPageComponent;
    let fixture: ComponentFixture<GameConfigPageComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatDialogModule, HttpClientModule],
            declarations: [GameConfigPageComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MatDialogRef, useValue: dialogMock }, FormBuilder],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameConfigPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change ennemy name when player names matchs', () => {
        const oldEnnemyName = component.randomPlayerName;
        component.gameConfigForm.get('name')?.setValue(component.randomPlayerName);
        fixture.detectChanges();
        expect(component.randomPlayerName).not.toEqual(oldEnnemyName);
    });

    it('play should pick ennemy player name', () => {
        const testConfigForm = {
            name: 'player',
            dictionary: Dictionary.French,
        };
        const testDataConfig = {
            playerName1: 'default',
            playerName2: 'default',
            duration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
        } as GameConfig;

        component.gameConfigForm.controls.name.setValue(testConfigForm.name);
        component.gameConfigForm.controls.dictionary.setValue(testConfigForm.dictionary);

        component.data.config = testDataConfig;
        const spy = spyOn(component, 'pickPlayerName').and.callThrough();
        component.play();
        expect(spy).toHaveBeenCalled();
    });

    it('should close after back()', () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.back();
        expect(spy).toHaveBeenCalled();
    });

    it('should choose a name different from that of the user', () => {
        const oldVirtualPlayerName = component.randomPlayerName;
        component.gameConfigForm.controls.name.setValue(component.randomPlayerName);
        component.pickPlayerName();
        const sameName = oldVirtualPlayerName === component.randomPlayerName;
        expect(sameName).toEqual(false);
    });
});
