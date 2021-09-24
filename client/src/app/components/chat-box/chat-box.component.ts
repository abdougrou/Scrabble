import { Component, HostListener } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { COMMAND_RESULT, SYSTEM_NAME } from '@app/constants';
import { CommandHandlerService } from '@app/services/command-handler.service';
import { GameManagerService } from '@app/services/game-manager.service';
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
    buttonPressed = '';
    message = '';
    chatMessage: ChatMessage = { user: '', body: '' };

    constructor(public gameManager: GameManagerService, public commandHandler: CommandHandlerService) {
        this.gameManager.commandResult.subscribe((message) => {
            this.showMessage(message);
        });
    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    submitInput(): void {
        const input = document.getElementById('message-input') as HTMLInputElement;
        if (input === null) {
            throw new Error('message-input error in the chatbox');
        } else {
            if (input.value !== '') {
                this.chatMessage.user = this.gameManager.mainPlayerName;
                this.chatMessage.body = this.message;
                this.showMessage(this.chatMessage);
                this.showMessage(this.checkCommand(this.chatMessage));
            }
            input.value = '';
        }
    }

    showMessage(message: ChatMessage): void {
        const newMessage = document.createElement('p');
        switch (message.user) {
            case SYSTEM_NAME:
                newMessage.innerHTML = message.user + ': ' + message.body;
                newMessage.style.color = 'red';
                break;
            case this.gameManager.mainPlayerName:
                newMessage.innerHTML = message.user + ': ' + message.body;
                newMessage.style.color = 'gray';
                break;
            case this.gameManager.enemyPlayerName:
                newMessage.innerHTML = message.user + ': ' + message.body;
                newMessage.style.color = 'darkgoldenrod';
                break;
            case COMMAND_RESULT:
                newMessage.innerHTML = message.body;
                newMessage.style.color = 'gray';
                break;
            default:
                newMessage.style.color = 'gray';
                break;
        }
        const parentMessage = document.getElementById('default-message');
        if (parentMessage === null) {
            throw new Error('the message sent can not be shown');
        } else {
            parentMessage.appendChild(newMessage);
        }
        this.scrollDown();
    }

    scrollDown(): void {
        const chatBody = document.getElementById('messages');
        if (chatBody === null) {
            throw new Error('can not scroll down in the chat box');
        } else {
            chatBody.scrollTop = 0;
        }
    }

    checkCommand(message: ChatMessage): ChatMessage {
        let systemMessage: ChatMessage = { user: '', body: '' };
        if (message.body.startsWith('!')) {
            systemMessage = this.commandHandler.checkCommand(message);
        }
        return systemMessage;
    }
}
