import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from './confirmation-popup.component';
import SpyObj = jasmine.SpyObj;

describe('ConfirmationPopupComponent', () => {
    let component: ConfirmationPopupComponent;
    let fixture: ComponentFixture<ConfirmationPopupComponent>;
    let dialogRefSpy: SpyObj<MatDialogRef<ConfirmationPopupComponent>>;

    beforeEach(() => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfirmationPopupComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: 'test' },
                { provide: MatDialogRef, useValue: dialogRefSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmationPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close its own dialog reference when quit is called', () => {
        component.quit(true);
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });
});
