import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayDictionaryPopupComponent } from './display-dictionary-popup.component';

describe('DisplayDictionaryPopupComponent', () => {
    let component: DisplayDictionaryPopupComponent;
    let fixture: ComponentFixture<DisplayDictionaryPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisplayDictionaryPopupComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DisplayDictionaryPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
