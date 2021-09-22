import { Component, HostListener } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
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
            // console.log('message-input error');
        } else {
            if (input.value !== '') {
                this.chatMessage.user = this.gameManagerService.players[0].name;
                this.chatMessage.body = this.message;
                // console.log(this.chatMessage);
                this.showMessage(this.chatMessage);
            }
            input.value = '';
        }
    }

    showMessage(message: ChatMessage): void {
        const newMessage = document.createElement('p');
        // change "user : " when u get the message class
        newMessage.innerHTML = message.user + ': ' + message.body;
        switch (message.user) {
            case 'System':
                newMessage.style.color = 'red';
                break;
            case this.gameManagerService.players[0].name:
                newMessage.style.color = 'gray';
                break;
            case this.gameManagerService.players[1].name:
                newMessage.style.color = 'darkgoldenrod';
                break;
            default:
                newMessage.style.color = 'gray';
                break;
        }
        const parentMessage = document.getElementById('default-message');
        if (parentMessage === null) {
            // console.log('message can not be shown');
        } else {
            parentMessage.appendChild(newMessage);
        }
        this.scrollDown();
    }

    scrollDown(): void {
        const chatBody = document.getElementById('messages');
        if (chatBody === null) {
            // console.log('can not scroll down in the chat box');
        } else {
            chatBody.scrollTop = 0;
        }
    }
}
