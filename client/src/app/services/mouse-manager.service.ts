import { Injectable } from '@angular/core';
import { TileState } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class MouseManagerService {
    getMousePosition(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    easelMouseClicked(isEasel: boolean, event: MouseEvent): TileState {
        switch (isEasel) {
            case true:
                if (event.button === MouseButton.Left) return TileState.Manipulation;
                else if (event.button === MouseButton.Right) return TileState.Exchange;
                return TileState.None;
            case false:
            default:
                return TileState.None;
        }
    }
}
