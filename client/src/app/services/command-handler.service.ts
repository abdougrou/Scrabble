import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommandHandlerService {
    exchange(command: string): string {
        const regex = new RegExp(/^!echanger ([a-z]|\*){0,7}/g);
        if (regex.test(command)) {
            // eslint-disable-next-line no-console
            console.log(command);
            return command;
        }
        return 'Erreur de syntaxe, pour échanger des lettres, il faut suivre le format suivant : !échanger (lettres du chevalet)';
    }

    place(command: string): string {
        const regex = new RegExp(/^!placer ([a-o]([1-9]|1[0-5])(h|v)) ([a-zA-Z]){2,15}$/g);
        if (regex.test(command)) {
            // eslint-disable-next-line no-console
            console.log(command);
            return command;
        }
        return 'Erreur de syntaxe, pour placer un mot, il faut suivre le format suivant : !placer (ligne)(colonne)(h | v) (mot)';
    }

    pass(): string {
        // if it's the player's turn, call switchPlayer() from gamemanagerservice
        return 'Vous avez passé votre tour';
    }
}
