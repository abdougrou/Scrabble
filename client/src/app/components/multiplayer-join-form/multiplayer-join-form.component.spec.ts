import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { MultiplayerJoinFormComponent } from './multiplayer-join-form.component';

describe('MultiplayerJoinFormComponent', () => {
    let component: MultiplayerJoinFormComponent;
    let fixture: ComponentFixture<MultiplayerJoinFormComponent>;

    const dialogMock = {
        close: () => {
            // Do nothing
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
            declarations: [MultiplayerJoinFormComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogMock }, { provide: MAT_DIALOG_DATA, useValue: {} }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerJoinFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
