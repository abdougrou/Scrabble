import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GameMode } from '@app/classes/game-config';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { CommunicationService } from '@app/services/communication.service';
import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let gameMode: GameMode;
    let fixture: ComponentFixture<MainPageComponent>;
    let communicationServiceSpy: SpyObj<CommunicationService>;

    beforeEach(async () => {
        // communicationServiceSpy = jasmine.createSpyObj('ExampleService', ['basicGet', 'basicPost']);
        // communicationServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        // communicationServiceSpy.basicPost.and.returnValue(of());

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, BrowserAnimationsModule, HttpClientModule, MatDialogModule],
            declarations: [MainPageComponent],
            providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        gameMode = GameMode.Classic;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('should have possibility to choose Classic Mode', () => {
        const spy = spyOn(component, 'start').and.callThrough();
        component.startClassic();
        // General function was called
        expect(spy).toHaveBeenCalled();
    });

    it('should have possibility to choose LOG2990 Mode', () => {
        const spy = spyOn(component, 'start').and.callThrough();
        component.startLOG();

        // General function was called
        expect(spy).toHaveBeenCalled();
    });

    it('start should open game mode popup', () => {
        const expectedHeader = 'Mode de jeu';

        component.start(gameMode);
        fixture.detectChanges();
        const popupHeader = document.getElementsByTagName('h2')[0] as HTMLHeadElement;

        expect(popupHeader.innerText).toEqual(expectedHeader);
        component.dialog.closeAll();
    });

    /*
    it('should call basicGet when calling getMessagesFromServer', () => {
        component.getMessagesFromServer();
        expect(communicationServiceSpy.basicGet).toHaveBeenCalled();
    });

    it('should call basicPost when calling sendTimeToServer', () => {
        component.sendTimeToServer();
        expect(communicationServiceSpy.basicPost).toHaveBeenCalled();
    });*/
});
