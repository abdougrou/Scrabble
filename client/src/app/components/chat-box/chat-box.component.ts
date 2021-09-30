import { Component, DoCheck, HostListener } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { SYSTEM_NAME } from '@app/constants';
import { CommandHandlerService } from '@app/services/command-handler.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements DoCheck {
    buttonPressed = '';
    message = '';
    chatMessage: ChatMessage = { user: '', body: '' };

    constructor(public gameManager: GameManagerService, public playerService: PlayerService, public commandHandler: CommandHandlerService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngDoCheck() {
        if (this.gameManager.isEnded === true) {
            const message = { user: SYSTEM_NAME, body: this.gameManager.endGameMessage } as ChatMessage;
            this.showMessage(message);
        }
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
                newMessage.innerHTML = `${message.user} : ${message.body}`;
                newMessage.style.color = '#cf000f';
                break;
            case this.gameManager.mainPlayerName:
                newMessage.innerHTML = `${message.user} : ${message.body}`;
                newMessage.style.color = 'gray';
                break;
            case this.gameManager.enemyPlayerName:
                newMessage.innerHTML = `${message.user} : ${message.body}`;
                newMessage.style.color = 'darkgoldenrod';
                break;
            default:
                newMessage.innerHTML = message.body;
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
            systemMessage = this.commandHandler.handleCommand(message.body, this.playerService.getPlayerByName(message.user));
        }
        return systemMessage;
    }
}
