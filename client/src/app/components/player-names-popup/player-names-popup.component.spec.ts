import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerNamesPopupComponent } from './player-names-popup.component';

describe('PlayerNamesPopupComponent', () => {
    let component: PlayerNamesPopupComponent;
    let fixture: ComponentFixture<PlayerNamesPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerNamesPopupComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNamesPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
