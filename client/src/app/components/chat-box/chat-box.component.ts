import { Component, DoCheck, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
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
    @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;
    @ViewChild('defaultMessage') defaultMessage: ElementRef<HTMLElement>;
    @ViewChild('chatBody') chatBody: ElementRef<HTMLElement>;

    buttonPressed = '';
    message = '';
    chatMessage: ChatMessage = { user: '', body: '' };
    player: Player;
    mainPlayerName: string;
    enemyPlayerName: string;

    constructor(
        public gameManager: GameManagerService,
        public playerService: PlayerService,
        public commandHandler: CommandHandlerService,
        private renderer: Renderer2,
    ) {
        this.mainPlayerName = this.gameManager.mainPlayerName;
        this.enemyPlayerName = this.gameManager.enemyPlayerName;
    }

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
        if (this.messageInput.nativeElement.value !== '') {
            this.chatMessage.user = this.mainPlayerName;
            this.chatMessage.body = this.message;
            this.player = this.getPlayerByName(this.chatMessage.user);
            this.showMessage(this.chatMessage);
            this.showMessage(this.checkCommand(this.chatMessage, this.player));
            this.messageInput.nativeElement.value = '';
        }
    }

    showMessage(message: ChatMessage): void {
        const newMessage: HTMLParagraphElement = this.renderer.createElement('p');
        switch (message.user) {
            case SYSTEM_NAME:
                newMessage.innerHTML = `${message.user} : ${message.body}`;
                newMessage.style.color = '#cf000f';
                break;
            case this.mainPlayerName:
                newMessage.innerHTML = `${message.user} : ${message.body}`;
                newMessage.style.color = 'gray';
                break;
            case this.enemyPlayerName:
                newMessage.innerHTML = `${message.user} : ${message.body}`;
                newMessage.style.color = 'darkgoldenrod';
                break;
            default:
                newMessage.innerHTML = message.body;
                newMessage.style.color = 'gray';
                break;
        }
        this.defaultMessage.nativeElement.appendChild(newMessage);
        this.scrollDown();
    }

    scrollDown(): void {
        this.chatBody.nativeElement.scrollTop = 0;
    }

    checkCommand(message: ChatMessage, player: Player): ChatMessage {
        let systemMessage: ChatMessage = { user: '', body: '' };
        if (message.body.startsWith('!')) {
            systemMessage = this.commandHandler.handleCommand(message.body, player);
        }
        return systemMessage;
    }

    getPlayerByName(name: string): Player {
        return this.playerService.getPlayerByName(name);
    }
}
