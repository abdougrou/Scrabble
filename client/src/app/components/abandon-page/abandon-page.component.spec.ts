import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonPageComponent } from './abandon-page.component';

describe('AbandonPageComponent', () => {
    let component: AbandonPageComponent;
    let fixture: ComponentFixture<AbandonPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AbandonPageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AbandonPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
