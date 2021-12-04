import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplayDictionaryPopupComponent } from './display-dictionary-popup.component';

describe('DisplayDictionaryPopupComponent', () => {
    let component: DisplayDictionaryPopupComponent;
    let fixture: ComponentFixture<DisplayDictionaryPopupComponent>;
    const data = { dictionary: { title: 'testDictionary', description: 'used for testing', words: ['test'] } };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisplayDictionaryPopupComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
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
