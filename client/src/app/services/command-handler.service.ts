import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { COMMANDS } from '@app/constants';
import { GameManagerService } from './game-manager.service';

@Injectable({
    providedIn: 'root',
})
export class CommandHandlerService {
    constructor(private gameManager: GameManagerService) {}
    handleCommand(command: string, player: Player): boolean {
        switch (command.split(' ')[0]) {
            case COMMANDS.exchange:
                return this.exchange(command, player);
            case COMMANDS.place:
                return this.place(command, player);
        }
        return false;
    }

    exchange(command: string, player: Player): boolean {
        const regex = new RegExp(/^!exchange ([a-z]|\*){0,7}/g);
        if (regex.test(command)) {
            this.gameManager.exchangeTiles(command.split(' ')[1], player);
            return true;
        }
        return false;
    }

    place(command: string, player: Player): boolean {
        const regex = new RegExp(/^!place ([a-o]([1-9]|1[0-5])(h|v)) ([a-zA-Z]){2,15}$/g);
        if (regex.test(command)) {
            const minus1 = -1;
            const direction = command.split(' ')[1].slice(minus1);
            const coord = command.split(' ')[1].slice(0, command.length - 1);
            this.gameManager.placeTiles(command.split(' ')[2], this.getCoordinateFromString(coord), direction[2] === 'v', player);
            return true;
        }
        return false;
    }

    getCoordinateFromString(coordStr: string): Vec2 {
        const CHAR_OFFSET = 'a'.charCodeAt(0);
        const coordX = coordStr[0].toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const coordY = parseInt(coordStr.substr(1, coordStr.length), 10) - 1;
        return { x: coordX, y: coordY } as Vec2;
    }
}
