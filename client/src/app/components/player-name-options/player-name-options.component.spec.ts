import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlayerNameOptionsComponent } from './player-name-options.component';
import SpyObj = jasmine.SpyObj;

describe('PlayerNameOptionsComponent', () => {
    let component: PlayerNameOptionsComponent;
    let fixture: ComponentFixture<PlayerNameOptionsComponent>;
    let dialogSpy: SpyObj<MatDialog>;
    let dialogRefSpy: SpyObj<MatDialogRef<PlayerNameOptionsComponent>>;

    beforeEach(() => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerNameOptionsComponent],
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: MatDialogRef, useValue: dialogRefSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNameOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the dialog reference when closeSelf is called', () => {
        component.closeSelf();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should open a new dialog when openBeginner is called', () => {
        component.openBeginner();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open a new dialog when openExpert is called', () => {
        component.openExpert();
        expect(dialogSpy.open).toHaveBeenCalled();
    });
});
