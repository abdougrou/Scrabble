import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
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
            imports: [HttpClientTestingModule, BrowserAnimationsModule, AppMaterialModule],
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
});
