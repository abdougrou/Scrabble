import { Component, HostListener } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { SYSTEM_NAME } from '@app/constants';
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

    constructor(public gameManagerService: GameManagerService, public commandHandlerService: CommandHandlerService) {}
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
                this.chatMessage.user = this.gameManagerService.mainPlayerName;
                this.chatMessage.body = this.message;
                // console.log(this.chatMessage);
                this.showMessage(this.chatMessage);
                this.checkCommand(this.chatMessage);
            }
            input.value = '';
        }
    }

    showMessage(message: ChatMessage): void {
        const newMessage = document.createElement('p');
        newMessage.innerHTML = message.user + ': ' + message.body;
        switch (message.user) {
            case SYSTEM_NAME:
                newMessage.style.color = 'red';
                break;
            case this.gameManagerService.mainPlayerName:
                newMessage.style.color = 'gray';
                break;
            case this.gameManagerService.enemyPlayerName:
                newMessage.style.color = 'darkgoldenrod';
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

    checkCommand(message: ChatMessage): void {
        const systemMessage: ChatMessage = { user: SYSTEM_NAME, body: '' };
        const msg = message.body.toLowerCase();
        if (msg.startsWith('!')) {
            if (msg.startsWith('!placer')) {
                systemMessage.body = this.commandHandlerService.place(message.body);
                this.showMessage(systemMessage);
            } else if (msg.startsWith('!echanger') || msg.startsWith('!échanger')) {
                systemMessage.body = this.commandHandlerService.exchange(message.body);
                this.showMessage(systemMessage);
            } else if (msg === '!passer') {
                systemMessage.body = this.commandHandlerService.pass();
                this.showMessage(systemMessage);
            } else {
                systemMessage.body = "La commande entrée n'est pas valide";
                this.showMessage(systemMessage);
            }
        }
    }
}
