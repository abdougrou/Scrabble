import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerNameFormComponent } from './player-name-form.component';

describe('PlayerNameFormComponent', () => {
    let component: PlayerNameFormComponent;
    let fixture: ComponentFixture<PlayerNameFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerNameFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNameFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
