import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { of } from 'rxjs';
import { ModeSelectionComponent } from './mode-selection.component';

describe('ModeSelectionComponent', () => {
    let component: ModeSelectionComponent;
    let fixture: ComponentFixture<ModeSelectionComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    const routerStub = {
        // eslint-disable-next-line no-unused-vars
        navigateByUrl: (url: string) => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, BrowserAnimationsModule, RouterTestingModule, AppMaterialModule],
            declarations: [ModeSelectionComponent],
            providers: [
                FormBuilder,
                { provide: Router, useValue: routerStub },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModeSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open game config popup', () => {
        // const expectedHeader = 'vous jouez contre';
        const spy = spyOn(component.dialog, 'open').and.callThrough();

        component.playSolo();
        fixture.detectChanges();
        // const popupHeader = document.getElementsByTagName('p')[0] as HTMLHeadElement;

        expect(spy).toHaveBeenCalled();
        component.dialog.closeAll();
    });

    it('should close after closeSelf()', () => {
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.closeSelf();
        expect(spy).toHaveBeenCalled();
    });

    it("should 'Retour' button call closeSelf()", () => {
        const spy = spyOn(component, 'closeSelf').and.callThrough();
        const button = fixture.debugElement.nativeElement.querySelector('#back');
        button.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should be closed if afterClosed returned true', () => {
        spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<ModeSelectionComponent>);
        const spy = spyOn(component.dialogRef, 'close').and.callThrough();
        component.playSolo();
        expect(spy).toHaveBeenCalled();
    });
});
