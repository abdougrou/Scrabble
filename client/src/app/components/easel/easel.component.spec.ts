import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { EaselTile, TileState } from '@app/classes/tile';
import { KEYBOARD_EVENT_RECEIVER, MouseButton, STARTING_TILE_AMOUNT } from '@app/constants';
import { MouseManagerService } from '@app/services/mouse-manager.service';
import { PlayerService } from '@app/services/player.service';
import { EaselComponent } from './easel.component';

// TODO : TEST ONCHANGES, AND TILECLICKED

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
            imports: [HttpClientTestingModule, RouterTestingModule],
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

    it('should call the moveLeft and moveRight methods when the left and right arrows are pressed', () => {
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        const mockRightArrowClick = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        const mockLeftArrowClick = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        spyOn(component, 'moveLeft');
        spyOn(component, 'moveRight');
        component.buttonDetect(mockRightArrowClick);
        component.buttonDetect(mockLeftArrowClick);
        expect(component.moveLeft).toHaveBeenCalled();
        expect(component.moveRight).toHaveBeenCalled();
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
        spyOn(component, 'moveRight');
        spyOn(component, 'moveLeft');
        component.scroll(mockWheelDown);
        expect(component.moveRight).toHaveBeenCalled();
        expect(component.moveLeft).not.toHaveBeenCalled();
    });

    it('should call moveLeft when the mouse wheel is scrolled up', () => {
        const SCROLL_UP_VALUE = -100;
        component.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.easel;
        const mockWheelUp = new WheelEvent('wheel', { deltaY: SCROLL_UP_VALUE });
        spyOn(component, 'moveLeft');
        spyOn(component, 'moveRight');
        component.scroll(mockWheelUp);
        expect(component.moveLeft).toHaveBeenCalled();
        expect(component.moveRight).not.toHaveBeenCalled();
    });

    it('should reset all tiles', () => {
        const tileA: EaselTile = { tile: { letter: 'a', points: 0 }, state: TileState.Manipulation };
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) component.tiles.push(tileA);
        component.resetTileState();
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) expect(component.tiles[i].state).toBe(TileState.None);
    });

    it('containsTile should return the good value', () => {
        const letters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) {
            const tile: EaselTile = { tile: { letter: letters[i], points: 0 }, state: TileState.None };
            component.tiles.push(tile);
        }
        const goodTile = 'a';
        const badTile = 'x';
        expect(component.containsTile(goodTile)).toBe(true);
        expect(component.containsTile(badTile)).toBe(false);
    });

    it('containsTile should return the good value', () => {
        const letters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) {
            const tile: EaselTile = { tile: { letter: letters[i], points: 0 }, state: TileState.None };
            component.tiles.push(tile);
        }
        const goodTile = 'a';
        const badTile = 'x';
        expect(component.containsTile(goodTile)).toBe(true);
        expect(component.containsTile(badTile)).toBe(false);
    });

    it('tileKeyboardClicked should return the first occurance of a tile when there is no selected tile', () => {
        const letters: string[] = ['a', 'b', 'c', 'b', 'e', 'b', 'e'];
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) {
            const tile: EaselTile = { tile: { letter: letters[i], points: 0 }, state: TileState.None };
            component.tiles.push(tile);
        }
        const secondTile = 'b';
        const fifthTile = 'e';
        const secondTileIndex = 1;
        const fifthTileIndex = 4;
        expect(component.tileKeyboardClicked(secondTile)).toBe(component.tiles[secondTileIndex]);
        expect(component.tileKeyboardClicked(fifthTile)).toBe(component.tiles[fifthTileIndex]);
    });

    it('tileKeyboardClicked should always return the same tile if there is only one occurance of it', () => {
        const letters: string[] = ['a', 'b', 'c', 'b', 'e', 'b', 'e'];
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) {
            const tile: EaselTile = { tile: { letter: letters[i], points: 0 }, state: TileState.None };
            component.tiles.push(tile);
        }
        const selectedTileIndex = 2;
        const selectedTileLetter = 'c';
        component.tiles[selectedTileIndex].state = TileState.Manipulation;
        expect(component.tileKeyboardClicked(selectedTileLetter)).toBe(component.tiles[selectedTileIndex]);
    });

    it('tileKeyboardClicked should return the next occuranced tile if the first occurance is selected', () => {
        const letters: string[] = ['a', 'b', 'c', 'b', 'e', 'b', 'e'];
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) {
            const tile: EaselTile = { tile: { letter: letters[i], points: 0 }, state: TileState.None };
            component.tiles.push(tile);
        }
        const selectedTileIndex = 3;
        const secondOccuranceTileIndex = 5;
        const selectedTileLetter = 'b';
        component.tiles[selectedTileIndex].state = TileState.Manipulation;
        expect(component.tileKeyboardClicked(selectedTileLetter)).toBe(component.tiles[secondOccuranceTileIndex]);
    });

    it('tileKeyboardClicked should return the first occuranced tile if there is no more occurances on the right of the selected tile', () => {
        const letters: string[] = ['a', 'b', 'c', 'b', 'e', 'b', 'e'];
        for (let i = 0; i < STARTING_TILE_AMOUNT; i++) {
            const tile: EaselTile = { tile: { letter: letters[i], points: 0 }, state: TileState.None };
            component.tiles.push(tile);
        }
        const firstOccuranceTileIndex = 1;
        const selectedTileIndex = 5;
        const selectedTileLetter = 'b';
        component.tiles[selectedTileIndex].state = TileState.Manipulation;
        expect(component.tileKeyboardClicked(selectedTileLetter)).toBe(component.tiles[firstOccuranceTileIndex]);
    });

    // it('should call selectTileForManipulation if we leftClick the tile', () => {
    //     const tile: EaselTile = { tile: { letter: 'a', points: 0 }, state: TileState.None };
    //     const mockMouseLeftClick = new MouseEvent('mousedown', { button: MouseButton.Left });
    //     spyOn(component, 'selectTileForManipulation');
    //     spyOn(mouseService, 'easelMouseClicked');
    //     component.tileClicked(tile, mockMouseLeftClick);
    //     expect(mouseService.easelMouseClicked).toHaveBeenCalled();
    // });
});
