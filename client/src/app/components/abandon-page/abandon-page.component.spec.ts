import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { AbandonPageComponent } from './abandon-page.component';
import SpyObj = jasmine.SpyObj;

describe('AbandonPageComponent', () => {
    let component: AbandonPageComponent;
    let routerSpy: SpyObj<Router>;
    let gameManagerSpy: SpyObj<GameManagerService>;
    let communicationSpy: SpyObj<CommunicationService>;
    let fixture: ComponentFixture<AbandonPageComponent>;

    beforeEach(() => {
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['reset']);
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['leaveLobby']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'url']);
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule, AppMaterialModule],
            declarations: [AbandonPageComponent],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: CommunicationService, useValue: communicationSpy },
                { provide: Router, useValue: routerSpy },
            ],
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

    it('should change the routers url when the user quits', async () => {
        const spy = routerSpy.navigateByUrl.and.resolveTo(true);
        component.quit();
        expect(spy).toHaveBeenCalled();
    });

    it('should called the leaveLobby function when the routers url is multiplayer', () => {
        spyOn(component, 'isMultiplayer').and.returnValue(true);
        const spy = communicationSpy.leaveLobby.and.returnValue();
        component.quit();
        expect(spy).toHaveBeenCalled();
    });
});
