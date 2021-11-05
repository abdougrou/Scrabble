import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';

@Injectable({
    providedIn: 'root',
})
export class ModeSelectionService {
    modeConfig: GameConfig;
}
