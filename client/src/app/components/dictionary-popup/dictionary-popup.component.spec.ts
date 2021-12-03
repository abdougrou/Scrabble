import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DictionaryPopupComponent } from './dictionary-popup.component';

describe('DictionaryPopupComponent', () => {
    let component: DictionaryPopupComponent;
    let fixture: ComponentFixture<DictionaryPopupComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
        afterClosed: () => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule],
            declarations: [DictionaryPopupComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogMock }],
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
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.back();
        expect(spy).toHaveBeenCalled();
    });

    it('edit should call modifyDictionary', () => {
        const dictionary = {
            title: 'Mon dictionaire',
            description: 'Basic Dict',
        };
        const spy = spyOn(component.dialogRef, 'afterClosed').and.returnValue(of('sdfa'));
        component.edit(dictionary);
        expect(spy).toHaveBeenCalled();
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
        const spy = spyOn(component.communication, 'getDictionaryFile').and.returnValue(of('sdf'));
        component.downloadDictionary(dictionary);
        expect(spy).toHaveBeenCalled();
    });

    it('is default should return true if its the default dictionary', () => {
        const dictionary = {
            title: 'Mon dictionaire',
            description: 'Basic Dict',
        };
        expect(component.isDefault(dictionary)).toBeTrue();
    });
});
