import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndGamePopupComponent } from './end-game-popup.component';

describe('EndGamePopupComponent', () => {
    let component: EndGamePopupComponent;
    let fixture: ComponentFixture<EndGamePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EndGamePopupComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EndGamePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
