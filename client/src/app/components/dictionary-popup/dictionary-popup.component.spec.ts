import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DictionaryPopupComponent } from './dictionary-popup.component';
import SpyObj = jasmine.SpyObj;

describe('DictionaryPopupComponent', () => {
    let component: DictionaryPopupComponent;
    let dialogSpy: SpyObj<MatDialog>;
    let dialogRefSpy: SpyObj<MatDialogRef<DictionaryPopupComponent>>;
    let snackBarSpy: SpyObj<MatSnackBar>;
    let fixture: ComponentFixture<DictionaryPopupComponent>;

    beforeEach(() => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'close']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule],
            declarations: [DictionaryPopupComponent],
            providers: [
                FormBuilder,
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: MatSnackBar, useValue: snackBarSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('get dictionaries should call communication get dictionaries', () => {
        const dictionary = [
            {
                title: 'Mon dictionaire',
                description: 'Basic Dict',
            },
        ];
        const spy = spyOn(component.communication, 'getDictionaryInfo').and.returnValue(of(dictionary));
        component.getDictionaries();
        expect(spy).toHaveBeenCalled();
    });

    it('back should close', () => {
        component.back();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('edit should call modifyDictionary', async () => {
        const dictionary = {
            title: 'Mon dictionaire',
            description: 'Basic Dict',
        };
        dialogSpy.open.and.returnValue(dialogRefSpy);
        dialogRefSpy.afterClosed.and.returnValue(of('something'));
        const spy = spyOn(component.communication, 'modifyDictionary').and.returnValue(of(true));
        component.edit(dictionary);
        component.dialogRef.close();
        expect(spy).toHaveBeenCalled();
    });

    it('edit should call modifyDictionary and open snackbar if modifydictionary returns false', async () => {
        const dictionary = {
            title: 'Mon dictionaire',
            description: 'Basic Dict',
        };
        dialogSpy.open.and.returnValue(dialogRefSpy);
        dialogRefSpy.afterClosed.and.returnValue(of('something'));
        const spy = spyOn(component.communication, 'modifyDictionary').and.returnValue(of(false));
        component.edit(dictionary);
        component.dialogRef.close();
        expect(spy).toHaveBeenCalled();
        expect(snackBarSpy.open).toHaveBeenCalled();
    });

    it('edit should not call modifyDictionary', () => {
        const dictionary = {
            title: 'Mon dictionaire',
            description: 'Basic Dict',
        };
        dialogSpy.open.and.returnValue(dialogRefSpy);
        dialogRefSpy.afterClosed.and.returnValue(of(''));
        const spy = spyOn(component.communication, 'modifyDictionary').and.returnValue(of(true));
        component.edit(dictionary);
        component.dialogRef.close();
        expect(spy).not.toHaveBeenCalled();
    });

    it('deleteDictionary should call communication deletedDictionary', () => {
        const dictionary = {
            title: 'Mon dictionaire',
            description: 'Basic Dict',
        };
        const spy = spyOn(component.communication, 'deleteDictionary').and.callThrough();
        component.deleteDictionary(dictionary);
        expect(spy).toHaveBeenCalled();
    });

    it('downloadDictionary should download it', () => {
        const dictionary = {
            title: 'Mon dictionaire',
            description: 'Basic Dict',
        };
        const spy = spyOn(component.communication, 'getDictionaryFile').and.callFake(() => of('sdf'));
        component.downloadDictionary(dictionary);
        expect(spy).toHaveBeenCalled();
    });

    it('is default should return true if its the default dictionary', () => {
        const dictionary = {
            title: 'Mon dictionnaire',
            description: 'Basic Dict',
        };
        expect(component.isDefault(dictionary)).toBeTrue();
    });
});
