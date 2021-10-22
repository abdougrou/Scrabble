import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { COMMANDS, COMMAND_RESULT, SYSTEM_NAME } from '@app/constants';
import { GameManagerService } from './game-manager.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class CommandHandlerService {
    constructor(private gameManager: GameManagerService, private reserveService: ReserveService) {}

    handleCommand(command: string, player: Player): ChatMessage {
        switch (command.split(' ')[0]) {
            case COMMANDS.exchange:
                return this.exchange(command, player);
            case COMMANDS.place:
                return this.place(command, player);
            case COMMANDS.pass:
                return this.pass(command, player);
            case COMMANDS.debug:
                return this.debug(command);
            default:
                return { user: SYSTEM_NAME, body: "La commande entrée n'est pas valide" } as ChatMessage;
        }
    }

    exchange(command: string, player: Player): ChatMessage {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!echanger ([a-z]|\*){0,7}/g);
        if (regex.test(command)) {
            commandResult.user = COMMAND_RESULT;
            commandResult.body = this.gameManager.exchangeTiles(command.split(' ')[1], player);
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body = 'Erreur de syntaxe, pour échanger des lettres, il faut suivre le format suivant : !echanger (lettre)...';
        }
        return commandResult;
    }

    place(command: string, player: Player): ChatMessage {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!placer ([a-o]([1-9]|1[0-5])(h|v)) ([a-zA-Z]){2,15}$/g);
        if (regex.test(command)) {
            const indexLastChar = -1;
            const direction = command.split(' ')[1].slice(indexLastChar);
            const coordStrDir = command.split(' ')[1];
            const coordStr = coordStrDir.slice(0, coordStrDir.length - 1);
            commandResult.user = COMMAND_RESULT;
            commandResult.body = this.gameManager.placeTiles(command.split(' ')[2], coordStr, direction === 'v', player);
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body = 'Erreur de syntaxe, pour placer un mot, il faut suivre le format suivant : !placer (ligne)(colonne)(h | v) (mot)';
        }
        return commandResult;
    }

    pass(command: string, player: Player): ChatMessage {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!passer$/g);
        if (regex.test(command)) {
            this.gameManager.skipTurn();
            commandResult.user = COMMAND_RESULT;
            commandResult.body = `${player.name} a passé son tour`;
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body = 'Erreur de syntaxe, pour passer son tour, il faut suivre le format suivant : !passer';
        }
        return commandResult;
    }

    debug(command: string): ChatMessage {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!debug$/g);
        if (regex.test(command)) {
            commandResult.user = COMMAND_RESULT;
            commandResult.body = this.gameManager.activateDebug();
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body =
                'Erreur de syntaxe, pour activer ou désactiver les affichages de débogage, il faut suivre le format suivant : !debug';
        }
        return commandResult;
    }

    reserve(command: string): ChatMessage {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!réserve$/g);
        if (regex.test(command) && this.gameManager.debug) {
            commandResult.user = COMMAND_RESULT;
            commandResult.body = this.reserveDisplay();
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body =
                'Erreur de syntaxe, pour activer ou désactiver les affichages de réserve, il faut suivre le format suivant : !réserve';
        }
        return commandResult;
    }

    reserveDisplay(): string {
        let display = '';
        this.reserveService.tiles.forEach((letter) => {
            display += `${letter.tile}: ${letter.count}\n`;
        });
        return display;
    }
}
