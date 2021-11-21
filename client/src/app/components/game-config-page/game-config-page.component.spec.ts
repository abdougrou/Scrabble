import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dictionary, GameConfig } from '@app/classes/game-config';
import { DURATION_INIT, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@app/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameManagerService } from '@app/services/game-manager.service';
import { GameConfigPageComponent } from './game-config-page.component';

describe('GameConfigPageComponent', () => {
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;
    let component: GameConfigPageComponent;
    let fixture: ComponentFixture<GameConfigPageComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(() => {
        gameManagerSpy = jasmine.createSpyObj<GameManagerService>('GameManagerService', ['initialize']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, AppMaterialModule],
            declarations: [GameConfigPageComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogMock },
                FormBuilder,
                { provide: GameManagerService, useValue: gameManagerSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameConfigPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.gameConfigForm = new FormGroup({
            name: new FormControl('name', [
                Validators.required,
                Validators.minLength(MIN_USERNAME_LENGTH),
                Validators.maxLength(MAX_USERNAME_LENGTH),
            ]),
            duration: new FormControl([DURATION_INIT]),
            bonusEnabled: new FormControl([false]),
            dictionary: new FormControl([Dictionary.French, Validators.required]),
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change enemy name when player names matchs', () => {
        const oldEnemyName = component.randomPlayerName;
        component.gameConfigForm.get('name')?.setValue(component.randomPlayerName);
        fixture.detectChanges();
        expect(component.randomPlayerName).not.toEqual(oldEnemyName);
    });

    it('play should pick enemy player name', () => {
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

    it('play should call gameManager initialize ', () => {
        const testConfigForm = {
            name: 'player',
            duration: DURATION_INIT,
            dictionary: Dictionary.French,
            bonusEnabled: false,
        };
        const testDataConfig = {
            playerName1: 'default',
            playerName2: 'default',
            duration: DURATION_INIT,
            bonusEnabled: false,
            dictionary: Dictionary.French,
        } as GameConfig;
        component.gameConfigForm.controls.name.setValue(testConfigForm.name);
        component.gameConfigForm.controls.duration.setValue(testConfigForm.duration);
        component.gameConfigForm.controls.dictionary.setValue(testConfigForm.dictionary);
        component.gameConfigForm.controls.bonusEnabled.setValue(testConfigForm.bonusEnabled);
        component.data.config = testDataConfig;
        component.play();
        expect(component.data.config.playerName1).toEqual(testConfigForm.name);
        expect(component.data.config.duration).toEqual(testConfigForm.duration);
        expect(component.data.config.bonusEnabled).toEqual(testConfigForm.bonusEnabled);
        expect(component.data.config.dictionary).toEqual(testConfigForm.dictionary);
        expect(gameManagerSpy.initialize).toHaveBeenCalled();
    });
});
