import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDictionaryPopupComponent } from './edit-dictionary-popup.component';

describe('EditDictionaryPopupComponent', () => {
    let component: EditDictionaryPopupComponent;
    let fixture: ComponentFixture<EditDictionaryPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditDictionaryPopupComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditDictionaryPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
