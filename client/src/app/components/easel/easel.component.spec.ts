import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { EaselTile, TileState } from '@app/classes/tile';
import { KEYBOARD_EVENT_RECEIVER, MouseButton } from '@app/constants';
import { MouseManagerService } from '@app/services/mouse-manager.service';
import { PlayerService } from '@app/services/player.service';
import { EaselComponent } from './easel.component';

describe('EaselComponent', () => {
    let component: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;
    let mouseService: MouseManagerService;
    let playerService: PlayerService;
    let player: Player;

    beforeEach(() => {
        playerService = new PlayerService();
        player = { name: 'player', score: 0, easel: new Easel() };
        playerService.players.push(player);
        playerService.mainPlayer = player;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EaselComponent],
            providers: [
                { provide: PlayerService, useValue: playerService },
                { provide: MouseManagerService, useValue: mouseService },
            ],
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

    it('should detect the mouse click and change the keyboard receiver', () => {
        spyOn(component.keyboardReceiverChange, 'emit');
        spyOn(component.isInside, 'emit');
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.none;
        const mockMouseClick = new MouseEvent('mousedown', { button: MouseButton.Left });
        component.mouseClick(mockMouseClick);
        expect(component.keyboardReceiver).toBe(KEYBOARD_EVENT_RECEIVER.easel);
        expect(component.keyboardReceiverChange.emit).toHaveBeenCalledOnceWith(KEYBOARD_EVENT_RECEIVER.easel);
        expect(component.isInside.emit).toHaveBeenCalledOnceWith(true);
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
        const mockRightArrowClick = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        const mockLeftArrowClick = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        component.buttonDetect(mockRightArrowClick);
        component.buttonDetect(mockLeftArrowClick);
        spyOn(component, 'moveLeft');
        spyOn(component, 'moveRight');
        expect(component.moveLeft).toHaveBeenCalledTimes(1);
        expect(component.moveRight).toHaveBeenCalledTimes(1);
    });

    it('should call selectTileForManipulation when the key is in the easel', () => {
        const tileA: EaselTile = { tile: { letter: 'a', points: 0 }, state: TileState.None };
        component.tiles = [tileA];
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        spyOn(component, 'selectTileForManipulation');
        const goodButtonClick = new KeyboardEvent('keydown', { key: 'a' });
        const badButtonClick = new KeyboardEvent('keydown', { key: 'k' });
        component.buttonDetect(goodButtonClick);
        component.buttonDetect(badButtonClick);
        expect(component.selectTileForManipulation).toHaveBeenCalledTimes(1);
    });

    it('should not call selectTileForManipulation when the key pressed is not in the easel', () => {
        const tileA: EaselTile = { tile: { letter: 'a', points: 0 }, state: TileState.None };
        component.tiles = [tileA];
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        spyOn(component, 'selectTileForManipulation');
        const badButtonClick = new KeyboardEvent('keydown', { key: 'k' });
        component.buttonDetect(badButtonClick);
        expect(component.selectTileForManipulation).not.toHaveBeenCalled();
    });

    it('should call resetTileState when the key pressed is not in the easel', () => {
        const tileA: EaselTile = { tile: { letter: 'a', points: 0 }, state: TileState.None };
        component.tiles = [tileA];
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        spyOn(component, 'resetTileState');
        const badButtonClick = new KeyboardEvent('keydown', { key: 'k' });
        component.buttonDetect(badButtonClick);
        expect(component.resetTileState).toHaveBeenCalled();
    });

    it('should call moveRight when the mouse wheel is scrolled down', () => {
        const SCROLL_DOWN_VALUE = 100;
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        const mockWheelDown = new WheelEvent('wheel', { deltaY: SCROLL_DOWN_VALUE });
        component.scroll(mockWheelDown);
        spyOn(component, 'moveRight');
        spyOn(component, 'moveLeft');
        expect(component.moveRight).toHaveBeenCalled();
        expect(component.moveLeft).not.toHaveBeenCalled();
    });

    it('should call moveLeft when the mouse wheel is scrolled up', () => {
        const SCROLL_UP_VALUE = -100;
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        const mockWheelUp = new WheelEvent('wheel', { deltaY: SCROLL_UP_VALUE });
        component.scroll(mockWheelUp);
        spyOn(component, 'moveLeft');
        spyOn(component, 'moveRight');
        expect(component.moveLeft).toHaveBeenCalled();
        expect(component.moveRight).not.toHaveBeenCalled();
    });
});
