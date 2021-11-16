import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingPopupComponent } from './ranking-popup.component';

describe('RankingPopupComponent', () => {
    let component: RankingPopupComponent;
    let fixture: ComponentFixture<RankingPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RankingPopupComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RankingPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
