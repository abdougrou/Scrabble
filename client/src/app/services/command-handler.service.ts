import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { COMMAND_RESULT, SYSTEM_NAME } from '@app/constants';
import { GameManagerService } from './game-manager.service';

@Injectable({
    providedIn: 'root',
})
export class CommandHandlerService {
    constructor(private gameManager: GameManagerService) {}

    checkCommand(message: ChatMessage): ChatMessage {
        let systemMessage: ChatMessage = { user: '', body: '' };
        if (message.body.startsWith('!placer')) {
            systemMessage = this.place(message);
        } else if (message.body.startsWith('!échanger')) {
            systemMessage = this.exchange(message);
        } else if (message.body === '!passer') {
            systemMessage = this.pass();
            // } else if (message.body === '!debug') {
            // systemMessage = this.commandHandler.debug();
        } else {
            systemMessage.user = SYSTEM_NAME;
            systemMessage.body = "La commande entrée n'est pas valide";
        }
        return systemMessage;
    }

    exchange(command: ChatMessage): ChatMessage {
        const regex = new RegExp(/^!échanger ([a-z]|\*){0,7}/g);
        if (regex.test(command.body)) {
            command.user = COMMAND_RESULT;
        } else {
            command.user = SYSTEM_NAME;
            command.body = 'Erreur de syntaxe, pour échanger des lettres, il faut suivre le format suivant : !échanger (lettre)...';
        }
        return command;
    }

    place(command: ChatMessage): ChatMessage {
        const regex = new RegExp(/^!placer ([a-o]([1-9]|1[0-5])(h|v)) ([a-zA-Z]){2,15}$/g);
        if (regex.test(command.body)) {
            this.gameManager.placeTiles(command);
        } else {
            command.user = SYSTEM_NAME;
            command.body = 'Erreur de syntaxe, pour placer un mot, il faut suivre le format suivant : !placer (ligne)(colonne)(h | v) (mot)';
        }
        return command;
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
