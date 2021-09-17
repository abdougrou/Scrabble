import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommandHandlerService {
    exchange(command: string): string {
        const regex = new RegExp(/^!exchange ([a-z]|\*){0,7}/g);
        if (regex.test(command)) {
            // eslint-disable-next-line no-console
            console.log(command);
            return command;
        }
        return 'INVALID COMMAND';
    }

    place(command: string): string {
        const regex = new RegExp(/^!place ([a-o]([1-9]|1[0-5])(h|v)) ([a-zA-Z]){2,15}$/g);
        if (regex.test(command)) {
            // eslint-disable-next-line no-console
            console.log(command);
            return command;
        }
        return 'INVALID COMMAND';
    }
}
