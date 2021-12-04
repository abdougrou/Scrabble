import { MultiplayerGameManagerService } from '@app/services/multiplayer-game-manager.service';
import { ContinueSoloMessage } from '@common/socket-messages';

export interface Message {
    title: string;
    body: string;
}

export interface ChatMessage {
    user: string;
    body: string;
}

export interface SwitchModeMessage {
    gameManager: MultiplayerGameManagerService;
    message: ContinueSoloMessage;
}
