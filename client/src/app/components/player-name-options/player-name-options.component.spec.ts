import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerNameOptionsComponent } from './player-name-options.component';

describe('PlayerNameOptionsComponent', () => {
    let component: PlayerNameOptionsComponent;
    let fixture: ComponentFixture<PlayerNameOptionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerNameOptionsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNameOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
