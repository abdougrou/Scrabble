import { TestBed } from '@angular/core/testing';
import { ChatMessage } from '@app/classes/message';
import { COMMAND_RESULT, SYSTEM_NAME } from '@app/constants';
import { CommandHandlerService } from './command-handler.service';

describe('CommandHandlerService', () => {
    let service: CommandHandlerService;
    const exchangeGood: ChatMessage = { user: '', body: '!échanger a' };
    const exchangeGoodStar: ChatMessage = { user: '', body: '!échanger *' };
    const exchangeWrong: ChatMessage = { user: '', body: 'échanger q' };
    const placeGood: ChatMessage = { user: '', body: '!placer a10v allo' };
    const placeCapital: ChatMessage = { user: '', body: '!placer c2h deVoir' };
    const placeWrong: ChatMessage = { user: '', body: '!placer p10h run' };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should be the good command', () => {
        expect(service.exchange(exchangeGood)).toEqual({ user: COMMAND_RESULT, body: '!échanger a' } as ChatMessage);
        expect(service.exchange(exchangeGoodStar)).toEqual({ user: COMMAND_RESULT, body: '!échanger *' } as ChatMessage);
        expect(service.exchange(exchangeWrong)).toEqual({
            user: SYSTEM_NAME,
            body: 'Erreur de syntaxe, pour échanger des lettres, il faut suivre le format suivant : !échanger (lettre)...',
        } as ChatMessage);
        expect(service.place(placeGood)).toEqual({ user: COMMAND_RESULT, body: '!placer a10v allo' } as ChatMessage);
        expect(service.place(placeCapital)).toEqual({ user: COMMAND_RESULT, body: '!placer c2h deVoir' } as ChatMessage);
        expect(service.place(placeWrong)).toEqual({
            user: SYSTEM_NAME,
            body: 'Erreur de syntaxe, pour placer un mot, il faut suivre le format suivant : !placer (ligne)(colonne)(h | v) (mot)',
        } as ChatMessage);
        expect(service.pass()).toEqual({ user: COMMAND_RESULT, body: 'Vous avez passé votre tour' } as ChatMessage);
    });
});
