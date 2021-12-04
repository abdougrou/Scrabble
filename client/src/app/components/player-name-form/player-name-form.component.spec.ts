import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormConfig, FormType } from '@app/classes/form-config';
import { PlayerNameFormComponent } from './player-name-form.component';
import SpyObj = jasmine.SpyObj;

describe('PlayerNameFormComponent', () => {
    let component: PlayerNameFormComponent;
    let fixture: ComponentFixture<PlayerNameFormComponent>;
    let dialogRefSpy: SpyObj<MatDialogRef<PlayerNameFormComponent>>;
    const formConfig: FormConfig = { formType: FormType.AddForm, data: 'test' };

    beforeEach(() => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerNameFormComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogRefSpy }, { provide: MAT_DIALOG_DATA, useValue: formConfig }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNameFormComponent);
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

    it('should display the correct message', () => {
        component.getMessage(FormType.AddForm);
        expect(component.message).toEqual('Entrer le nom du joueur à ajouter:');
        component.getMessage(FormType.EditForm);
        expect(component.message).toEqual('Entrer les modifications:');
    });
});
