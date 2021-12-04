import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication.service';
import { of } from 'rxjs';
import { RankingPopupComponent } from './ranking-popup.component';
import SpyObj = jasmine.SpyObj;

describe('RankingPopupComponent', () => {
    let component: RankingPopupComponent;
    let communicationSpy: SpyObj<CommunicationService>;
    let fixture: ComponentFixture<RankingPopupComponent>;

    beforeEach(() => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['getClassicRanking', 'getLog2990Ranking']);
    });

    beforeEach(async () => {
        communicationSpy.getClassicRanking.and.returnValue(of([{ name: 'name', score: 2 }]));
        communicationSpy.getLog2990Ranking.and.returnValue(of([{ name: 'name', score: 2 }]));
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule, AppMaterialModule],
            declarations: [RankingPopupComponent],
            providers: [{ provide: CommunicationService, useValue: communicationSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RankingPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', async () => {
        expect(component).toBeTruthy();
    });
});
