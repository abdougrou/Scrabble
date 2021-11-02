import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiplayerRoomsComponent } from './multiplayer-rooms.component';

describe('MultiplayerRoomsComponent', () => {
    let component: MultiplayerRoomsComponent;
    let fixture: ComponentFixture<MultiplayerRoomsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultiplayerRoomsComponent],
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
