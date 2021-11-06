import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
            imports: [HttpClientTestingModule, MatDialogModule],
            declarations: [MultiplayerRoomsComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: {} },
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
