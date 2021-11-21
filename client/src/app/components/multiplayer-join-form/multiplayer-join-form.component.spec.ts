import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
            imports: [HttpClientTestingModule, AppMaterialModule],
            declarations: [MultiplayerJoinFormComponent],
            providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogMock }],
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
