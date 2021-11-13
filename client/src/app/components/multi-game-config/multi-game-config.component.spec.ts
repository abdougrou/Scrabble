import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MultiGameConfigComponent } from './multi-game-config.component';

describe('MultiGameConfigComponent', () => {
    let component: MultiGameConfigComponent;
    let fixture: ComponentFixture<MultiGameConfigComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule],
            declarations: [MultiGameConfigComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogMock }, { provide: MAT_DIALOG_DATA, useValue: {} }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiGameConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
