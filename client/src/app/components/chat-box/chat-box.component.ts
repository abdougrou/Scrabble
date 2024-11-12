import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { COMMANDS, KEYBOARD_EVENT_RECEIVER, MouseButton, SYSTEM_NAME } from '@app/constants';
import { CommandHandlerService } from '@app/services/command-handler.service';
import { CommunicationService } from '@app/services/communication.service';
import { GameManagerInterfaceService } from '@app/services/game-manager-interface.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';
import { PlayerService } from '@app/services/player.service';

interface StyledChatMessage extends ChatMessage {
    timestamp: string;
    type: 'system' | 'user' | 'enemy' | 'default';
}

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnChanges {
    @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;
    @ViewChild('chatBody') chatBody: ElementRef;

    @Input() keyboardReceiver: string;
    @Output() keyboardReceiverChange = new EventEmitter<string>();
    @Output() isInside = new EventEmitter<boolean>();

    buttonPressed = '';
    message = '';
    messages: StyledChatMessage[] = [];
    chatMessage: StyledChatMessage = { user: '', body: '', timestamp: '', type: 'default' };
    player: Player;
    mainPlayerName: string;
    enemyPlayerName: string;
    manualPlacementMessage: string;
    lastCommand: string;

    constructor(
        public gameManager: GameManagerService,
        public multiplayerGameManager: MultiplayerGameManagerService,
        public gameManagerInterface: GameManagerInterfaceService,
        public playerService: PlayerService,
        public commandHandler: CommandHandlerService,
        private communication: CommunicationService,
        private router: Router,
    ) {
        if (this.router.url === '/multiplayer-game') {
            this.mainPlayerName = this.multiplayerGameManager.mainPlayerName;
            this.enemyPlayerName = this.playerService.players.find((player) => player.name !== this.mainPlayerName)?.name as string;
        } else {
            this.mainPlayerName = this.gameManager.gameConfig.playerName1;
            this.enemyPlayerName = this.gameManager.gameConfig.playerName2;
        }
        this.player = gameManagerInterface.getMainPlayer();
        // Subscribe to messages
        this.gameManager.commandMessage.asObservable().subscribe((msg) => {
            this.addMessage(msg);
        });
        this.communication.serverMessage.asObservable().subscribe((msg) => {
            this.addMessage(msg);
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
            const newMessage: StyledChatMessage = {
                user: this.mainPlayerName,
                body: this.message,
                timestamp: this.getCurrentTime(),
                type: 'user',
            };

            this.messageInput.nativeElement.value = '';

            if (this.router.url === '/game') {
                this.addMessage(newMessage);
                const commandResponse = this.checkCommand(newMessage, this.player);
                if (commandResponse.body) {
                    this.addMessage(commandResponse);
                }
            } else if (this.router.url === '/multiplayer-game') {
                this.player = this.multiplayerGameManager.getMainPlayer();
                if (!this.isCommand(newMessage.body)) {
                    this.communication.sendMessage(newMessage);
                } else {
                    this.addMessage(newMessage);
                    this.handleMultiplayerCommand(newMessage);
                }
            }

            this.message = '';
        }
    }

    showMessage(message: ChatMessage): void {
        if (message.body !== '') {
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
    }

    scrollDown(): void {
        setTimeout(() => {
            if (this.chatBody) {
                this.chatBody.nativeElement.scrollTop = 0;
            }
        });
    }

    handleMultiplayerCommand(message: StyledChatMessage) {
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
                this.addMessage(this.commandHandler.debug(message.body));
                break;
            case COMMANDS.reserve:
                this.addMessage(this.commandHandler.reserve(message.body));
                break;
            default:
                this.addMessage({
                    user: SYSTEM_NAME,
                    body: "La commande entrée n'est pas valide",
                    timestamp: this.getCurrentTime(),
                    type: 'system',
                } as StyledChatMessage);
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

    private getCurrentTime(): string {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    private addMessage(message: ChatMessage): void {
        if (message.body !== '') {
            const styledMessage: StyledChatMessage = {
                ...message,
                timestamp: this.getCurrentTime(),
                type: 'default',
            };

            // Determine message type
            switch (message.user) {
                case SYSTEM_NAME: {
                    styledMessage.type = 'system';

                    break;
                }
                case this.mainPlayerName: {
                    styledMessage.type = 'user';

                    break;
                }
                case this.enemyPlayerName: {
                    styledMessage.type = 'enemy';

                    break;
                }
                // No default
            }

            this.messages.unshift(styledMessage); // Add to start of array for reverse display
            this.scrollDown();
        }
    }
}
