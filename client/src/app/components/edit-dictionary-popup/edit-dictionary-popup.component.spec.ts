import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryInfo } from '@common/dictionaryTemplate';
import { EditDictionaryPopupComponent } from './edit-dictionary-popup.component';
import SpyObj = jasmine.SpyObj;

describe('EditDictionaryPopupComponent', () => {
    let component: EditDictionaryPopupComponent;
    let fixture: ComponentFixture<EditDictionaryPopupComponent>;
    let dialogRefSpy: SpyObj<MatDialogRef<EditDictionaryPopupComponent>>;
    const formConfig: DictionaryInfo = { title: 'testConfig', description: 'testDescription' };

    beforeEach(() => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditDictionaryPopupComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogRefSpy }, { provide: MAT_DIALOG_DATA, useValue: formConfig }],
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

    it('should close the dialog when confirm is called', () => {
        component.confirm();
        expect(component.dialogRef.close).toHaveBeenCalled();
    });

    it('should close the dialog when cancel is called', () => {
        component.cancel();
        expect(component.dialogRef.close).toHaveBeenCalled();
    });
});
