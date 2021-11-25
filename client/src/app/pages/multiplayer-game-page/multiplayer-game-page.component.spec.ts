import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { KEYBOARD_EVENT_RECEIVER, MouseButton } from '@app/constants';
import { MultiplayerGamePageComponent } from './multiplayer-game-page.component';

describe('MultiplayerGamePageComponent', () => {
    let component: MultiplayerGamePageComponent;
    let fixture: ComponentFixture<MultiplayerGamePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            declarations: [MultiplayerGamePageComponent, PlayAreaComponent, ChatBoxComponent, SidebarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerGamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should increment mouse click counter', () => {
        const previousClickCounter = component.clickInsideCounter;
        const myComponent = fixture.debugElement.query(By.css('div'));
        myComponent.triggerEventHandler('click', { button: MouseButton.Left });
        fixture.detectChanges();
        expect(component.clickInsideCounter).toBeGreaterThan(previousClickCounter);
    });

    it('keyboard receiver should equal none', () => {
        const myComponent = fixture.debugElement.query(By.css('div'));
        myComponent.triggerEventHandler('click', { button: MouseButton.Left });
        fixture.detectChanges();
        expect(component.keyboardReceiver).toEqual(KEYBOARD_EVENT_RECEIVER.none);
    });

    it('click inside counter should equal zero when clicked inside', () => {
        component.clickedInside(true);
        expect(component.clickInsideCounter).toEqual(1);
        component.clickedInside(true);
        expect(component.clickInsideCounter).toEqual(0);
    });

    it('should change keyboard receiver', () => {
        component.changeKeyboardReceiver(KEYBOARD_EVENT_RECEIVER.chatbox);
        expect(component.keyboardReceiver).toEqual(KEYBOARD_EVENT_RECEIVER.chatbox);
    });
});
