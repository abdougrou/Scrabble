import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { KEYBOARD_EVENT_RECEIVER, MouseButton, SYSTEM_NAME } from '@app/constants';
import { CommandHandlerService } from '@app/services/command-handler.service';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { ModeSelectionService } from '@app/services/mode-selection.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnChanges {
    @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;

    @Input() keyboardReceiver: string;
    @Output() keyboardReceiverChange = new EventEmitter<string>();
    @Output() isInside = new EventEmitter<boolean>();

    buttonPressed = '';
    message = '';
    chatMessage: ChatMessage = { user: '', body: '' };
    player: Player;
    mainPlayerName: string;
    enemyPlayerName: string;
    manualPlacementMessage: string;
    lastCommand: string;

    constructor(
        public gameManager: GameManagerService,
        public playerService: PlayerService,
        public commandHandler: CommandHandlerService,
        private communication: CommunicationService,
        private mode: ModeSelectionService,
    ) {
        this.mainPlayerName = this.gameManager.mainPlayerName;
        this.enemyPlayerName = this.gameManager.enemyPlayerName;
        this.gameManager.commandMessage.asObservable().subscribe((msg) => {
            this.showMessage(msg);
        });
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.keyboardReceiver) {
            if (this.keyboardReceiver === KEYBOARD_EVENT_RECEIVER.chatbox) {
                // focus l'input du text
            }
        }
    }

    submitInput(): void {
        if (this.messageInput.nativeElement.value !== '') {
            this.chatMessage.user = this.mainPlayerName;
            this.chatMessage.body = this.message;
            this.player = this.getPlayerByName(this.chatMessage.user);
            this.messageInput.nativeElement.value = '';
            if (!this.mode.modeConfig.isMultiPlayer) {
                this.showMessage(this.chatMessage);
                this.showMessage(this.checkCommand(this.chatMessage, this.player));
            } else {
                // call communcation service
            }
        }
    }

    showMessage(message: ChatMessage): void {
        const newMessage = document.createElement('p');
        switch (message.user) {
            case SYSTEM_NAME:
                newMessage.innerHTML = `${message.user} : ${message.body}`;
                newMessage.style.color = 'rgb(207, 0, 15)';
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
        const parentMessage = document.getElementById('default-message');
        if (parentMessage) {
            parentMessage.appendChild(newMessage);
        }
        this.scrollDown();
    }

    scrollDown(): void {
        const chatBody = document.getElementById('messages');
        if (chatBody) {
            chatBody.scrollTop = 0;
        }
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

    insideChatBox(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.chatbox;
            this.keyboardReceiverChange.emit(KEYBOARD_EVENT_RECEIVER.chatbox);
            this.isInside.emit(true);
        }
    }
}
