import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { COMMANDS, KEYBOARD_EVENT_RECEIVER, MouseButton, SYSTEM_NAME } from '@app/constants';
import { CommandHandlerService } from '@app/services/command-handler.service';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';
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
        public multiplayerGameManager: MultiplayerGameManagerService,
        public playerService: PlayerService,
        public commandHandler: CommandHandlerService,
        private communication: CommunicationService,
        private router: Router,
    ) {
        this.mainPlayerName = this.gameManager.mainPlayerName;
        this.enemyPlayerName = this.gameManager.enemyPlayerName;
        this.gameManager.commandMessage.asObservable().subscribe((msg) => {
            this.showMessage(msg);
        });
        this.communication.serverMessage.asObservable().subscribe((msg) => {
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
            this.showMessage(this.chatMessage);
            if (this.router.url === '/game') {
                this.showMessage(this.checkCommand(this.chatMessage, this.player));
            } else if (this.router.url === '/multiplayer-game') {
                if (!this.isCommand(this.chatMessage.body)) this.communication.sendMessage(this.chatMessage);
                else {
                    this.handleMultiplayerCommand(this.chatMessage);
                }
            }
        }
    }

    showMessage(message: ChatMessage): void {
        const newMessage = document.createElement('p');
        switch (message.user) {
            case SYSTEM_NAME:
                newMessage.innerHTML = message.body;
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

    handleMultiplayerCommand(message: ChatMessage) {
        switch (message.body.split(' ')[0]) {
            case COMMANDS.exchange:
                this.multiplayerExchange(message.body);
                break;
            case COMMANDS.place:
                this.multiplayerPlace(message.body);
                break;
            case COMMANDS.pass:
                this.lastCommand = message.body;
                this.multiplayerGameManager.skipTurn();
                break;
            case COMMANDS.debug:
                this.showMessage(this.commandHandler.debug(message.body));
                break;
            case COMMANDS.reserve:
                this.showMessage(this.commandHandler.reserve(message.body));
                break;
            default:
                this.showMessage({ user: SYSTEM_NAME, body: "La commande entrée n'est pas valide" } as ChatMessage);
                break;
        }
    }

    checkCommand(message: ChatMessage, player: Player): ChatMessage {
        let systemMessage: ChatMessage = { user: '', body: '' };
        if (this.isCommand(message.body)) {
            systemMessage = this.commandHandler.handleCommand(message.body, player);
        }
        return systemMessage;
    }

    multiplayerPlace(command: string) {
        const regex = new RegExp(/^!placer ([a-o]([1-9]|1[0-5])(h|v)) ([a-zA-Z]){2,15}$/g);
        if (regex.test(command)) {
            this.lastCommand = command;
            const indexLastChar = -1;
            const direction = command.split(' ')[1].slice(indexLastChar);
            const coordStrDir = command.split(' ')[1];
            const coordStr = coordStrDir.slice(0, coordStrDir.length - 1);
            this.multiplayerGameManager.placeLetters(command.split(' ')[2], coordStr, direction === 'v', this.player);
        } else {
            this.showMessage({
                user: SYSTEM_NAME,
                body: 'Erreur de syntaxe, pour placer un mot, il faut suivre le format suivant : !placer (ligne)(colonne)(h | v) (mot)',
            });
        }
    }

    multiplayerExchange(command: string) {
        const regex = new RegExp(/^!échanger ([a-z]|\*){0,7}/g);
        if (regex.test(command)) {
            this.lastCommand = command;
            this.multiplayerGameManager.exchangeLetters(command.split(' ')[1], this.player);
        } else {
            this.showMessage({
                user: SYSTEM_NAME,
                body: 'Erreur de syntaxe, pour échanger des lettres, il faut suivre le format suivant : !echanger (lettre)...',
            });
        }
    }

    multiplayerReserve(command: string) {
        const commandResult: ChatMessage = { user: '', body: '' };
        const regex = new RegExp(/^!réserve$/g);
        if (this.gameManager.debug) {
            if (regex.test(command)) {
                this.communication.showReserve();
            } else {
                this.showMessage({
                    user: SYSTEM_NAME,
                    body: 'Erreur de syntaxe, pour activer ou désactiver les affichages de réserve, il faut suivre le format suivant : !réserve',
                });
            }
        } else {
            commandResult.user = SYSTEM_NAME;
            commandResult.body =
                "La commande !réserve n'est accessible que lorsque les affichages de débogages sont activés," +
                'pour les activer, entrez la commande !debug ';
        }
    }

    isCommand(msg: string): boolean {
        return msg.startsWith('!');
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
