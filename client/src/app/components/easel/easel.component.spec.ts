import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselTile, TileState } from '@app/classes/tile';
import { KEYBOARD_EVENT_RECEIVER } from '@app/constants';
import { EaselComponent } from './easel.component';

describe('EaselComponent', () => {
    let component: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EaselComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should detect the button pressed if easel is the keyboard receiver', () => {
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        component.buttonPressed = 'a';
        const mockButtonClick = new KeyboardEvent('keydown', { key: 'k' });
        component.buttonDetect(mockButtonClick);
        expect(component.buttonPressed).toBe('k');
    });

    it("shouldn't detect the button pressed if easel isn't the keyboard receiver", () => {
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.none;
        component.buttonPressed = 'a';
        const mockButtonClick = new KeyboardEvent('keydown', { key: 'k' });
        component.buttonDetect(mockButtonClick);
        expect(component.buttonPressed).toBe('a');
    });

    it('should detect the "*" when SHIFT+8 is pressed', () => {
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        component.buttonPressed = 'a';
        const mockButtonClick = new KeyboardEvent('keydown', { shiftKey: true, key: '*' });
        component.buttonDetect(mockButtonClick);
        expect(component.buttonPressed).toBe('*');
    });

    // NOT SURE IF IT SHOULDN'T DETECT '*'
    // it("shouldn't detect the '*' when SHIFT isn't pressed", () => {
    //     component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
    //     component.buttonPressed = 'a';
    //     const mockButtonClick = new KeyboardEvent('keydown', { shiftKey: false, key: '*' });
    //     component.buttonDetect(mockButtonClick);
    //     expect(component.buttonPressed).toBe('a');
    // });

    it('should call the moveLeft and moveRight methods when the left and right arrows are pressed', () => {
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        component.buttonPressed = 'a';
        const mockRightArrowClick = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        const mockLeftArrowClick = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        component.buttonDetect(mockRightArrowClick);
        component.buttonDetect(mockLeftArrowClick);
        expect(component.moveLeft).toHaveBeenCalled();
        expect(component.moveRight).toHaveBeenCalled();
    });

    it('should call selectTileForManipulation only when the key is in Easel', () => {
        const tileA: EaselTile = { tile: { letter: 'a', points: 0 }, state: TileState.None };
        component.tiles = [tileA];
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        component.buttonPressed = 'a';
        const goodButtonClick = new KeyboardEvent('keydown', { key: 'a' });
        const badButtonClick = new KeyboardEvent('keydown', { key: 'k' });
        component.buttonDetect(goodButtonClick);
        component.buttonDetect(badButtonClick);
        expect(component.selectTileForManipulation).toHaveBeenCalledTimes(1);
    });
});
