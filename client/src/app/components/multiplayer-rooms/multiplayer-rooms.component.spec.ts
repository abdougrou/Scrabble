import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameMode } from '@common/lobby-config';
import { MultiplayerRoomsComponent } from './multiplayer-rooms.component';

describe('MultiplayerRoomsComponent', () => {
    let component: MultiplayerRoomsComponent;
    let fixture: ComponentFixture<MultiplayerRoomsComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, AppMaterialModule],
            declarations: [MultiplayerRoomsComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { mode: GameMode.Classic } },
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
});
