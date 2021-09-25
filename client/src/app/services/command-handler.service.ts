import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { COMMANDS, COMMAND_RESULT, SYSTEM_NAME } from '@app/constants';
import { GameManagerService } from './game-manager.service';

@Injectable({
    providedIn: 'root',
})
export class CommandHandlerService {
    constructor(private gameManager: GameManagerService) {}

    handleCommand(command: string, player: Player): ChatMessage {
        switch (command.split(' ')[0]) {
            case COMMANDS.exchange:
                return this.exchange(command, player);
            case COMMANDS.place:
                return this.place(command, player);
            case COMMANDS.pass:
                return this.pass();
            default:
                return { user: SYSTEM_NAME, body: "La commande entrée n'est pas valide" } as ChatMessage;
        }
    }

    exchange(command: string, player: Player): ChatMessage {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!échanger ([a-z]|\*){0,7}/g);
        if (regex.test(command)) {
            commandResult.body = this.gameManager.exchangeTiles(command.split(' ')[1], player);
            commandResult.user = COMMAND_RESULT;
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body = 'Erreur de syntaxe, pour échanger des lettres, il faut suivre le format suivant : !échanger (lettre)...';
        }
        return commandResult;
    }

    place(command: string, player: Player): ChatMessage {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!placer ([a-o]([1-9]|1[0-5])(h|v)) ([a-zA-Z]){2,15}$/g);
        if (regex.test(command)) {
            const minus1 = -1;
            const direction = command.split(' ')[1].slice(minus1);
            const coord = command.split(' ')[1].slice(0, command.length - 1);
            window.alert('les coords sont : ' + coord + ' et la direction est : ' + direction);
            this.gameManager.placeTiles(command.split(' ')[2], this.getCoordinateFromString(coord), direction === 'v', player);
            commandResult.user = COMMAND_RESULT;
            let directionString = '';
            if (direction === 'v') directionString = 'verticale';
            else directionString = 'horizontale';
            commandResult.body =
                player.name +
                ' a placé le mot : (' +
                command.split(' ')[2] +
                ') dans la direction ' +
                directionString +
                ' qui débute à la case ' +
                coord;
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body = 'Erreur de syntaxe, pour placer un mot, il faut suivre le format suivant : !placer (ligne)(colonne)(h | v) (mot)';
        }
        return commandResult;
    }

    getCoordinateFromString(coordStr: string): Vec2 {
        const CHAR_OFFSET = 'a'.charCodeAt(0);
        const coordX = coordStr[0].toLowerCase().charCodeAt(0) - CHAR_OFFSET;
        const coordY = parseInt(coordStr.substr(1, coordStr.length), 10) - 1;
        return { x: coordX, y: coordY } as Vec2;
    }

    pass(): ChatMessage {
        // if it's the player's turn, call switchPlayer() from gamemanagerservice
        const msg: ChatMessage = { user: COMMAND_RESULT, body: 'Vous avez passé votre tour' };
        return msg;
    }

    // debug(): ChatMessage {
    //     this.gameManager.debug();
    // }
}
