// import { HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ChatMessage } from '@app/classes/message';
// import { SYSTEM_NAME } from '@app/constants';
// import { AppMaterialModule } from '@app/modules/material.module';
// import { CommandHandlerService } from '@app/services/command-handler.service';
// import { PlayerService } from '@app/services/player.service';
// import { ChatBoxComponent } from './chat-box.component';

// describe('ChatBoxComponent', () => {
//     let component: ChatBoxComponent;
//     let commandHandlerSpy: jasmine.SpyObj<CommandHandlerService>;
//     let playerSpy: jasmine.SpyObj<PlayerService>;
//     let fixture: ComponentFixture<ChatBoxComponent>;

//     beforeEach(() => {
//         commandHandlerSpy = jasmine.createSpyObj<CommandHandlerService>('CommandHandlerService', ['handleCommand']);
//         playerSpy = jasmine.createSpyObj<PlayerService>('PlayerService', ['getPlayerByName']);
//     });

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [HttpClientModule, RouterTestingModule, AppMaterialModule],
//             declarations: [ChatBoxComponent],
//             providers: [
//                 { provide: CommandHandlerService, useValue: commandHandlerSpy },
//                 { provide: PlayerService, useValue: playerSpy },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(ChatBoxComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should detect the button pressed', () => {
//         const mockButtonClick = new KeyboardEvent('keydown', { key: 'k' });
//         component.buttonDetect(mockButtonClick);
//         expect(component.buttonPressed).toBe('k');
//     });

//     // it('should put the input value in the chatMessage', () => {
//     //     const input = document.getElementById('message-input') as HTMLInputElement;
//     //     input.value = 'message';
//     //     component.submitInput();
//     //     expect(component.message).toEqual(input.value);
//     // });

//     it('should add the system message in red in the chat', () => {
//         const parentMessage = document.getElementById('default-message');
//         const systemMessage = { user: SYSTEM_NAME, body: 'system Message' } as ChatMessage;
//         const systemHtmlMessage = 'system Message';
//         component.showMessage(systemMessage);
//         expect(parentMessage?.innerText).toEqual(systemHtmlMessage);
//         expect(parentMessage?.innerHTML.split('color: ')[1].split(';')[0]).toEqual('rgb(207, 0, 15)');
//     });

//     it('should add main player message in gray in the chat', () => {
//         const parentMessage = document.getElementById('default-message');
//         component.mainPlayerName = 'Player';
//         const mainPlayerMessage = { user: 'Player', body: 'main player message' } as ChatMessage;
//         const mainPlayerHtmlMessage = 'Player : main player message';
//         component.showMessage(mainPlayerMessage);
//         expect(parentMessage?.innerText).toEqual(mainPlayerHtmlMessage);
//         expect(parentMessage?.innerHTML.split('color: ')[1].split(';')[0]).toEqual('gray');
//     });

//     it('should add enemy player message in darkgoldenrod color in the chat', () => {
//         const parentMessage = document.getElementById('default-message');
//         component.enemyPlayerName = 'EnemyPlayer';
//         const enemyPlayerMessage = { user: 'EnemyPlayer', body: 'enemy player message' } as ChatMessage;
//         const enemyPlayerHtmlMessage = 'EnemyPlayer : enemy player message';
//         component.showMessage(enemyPlayerMessage);
//         expect(parentMessage?.innerText).toEqual(enemyPlayerHtmlMessage);
//         expect(parentMessage?.innerHTML.split('color: ')[1].split(';')[0]).toEqual('darkgoldenrod');
//     });

//     it('should add command results in gray in the chat', () => {
//         const parentMessage = document.getElementById('default-message');
//         const commandResult = { user: 'Commande', body: 'this is a result of a command' } as ChatMessage;
//         const commandResultHtmlMessage = 'this is a result of a command';
//         component.showMessage(commandResult);
//         expect(parentMessage?.innerText).toEqual(commandResultHtmlMessage);
//         expect(parentMessage?.innerHTML.split('color: ')[1].split(';')[0]).toEqual('gray');
//     });

//     // it('should scrollDown in the chat', () => {
//     //     const chatBody = document.getElementById('messages');
//     //     if (chatBody) chatBody.scrollTop = 10;
//     //     component.scrollDown();
//     //     expect(chatBody?.scrollTop).toBe(0);
//     // });

//     // it('checkCommand should call commandHandler handleCommand when command is valid ', () => {
//     //     const goodCommand = { user: '', body: '!placer' } as ChatMessage;
//     //     const badCommand = { user: '', body: 'placer' } as ChatMessage;
//     //     const emptyCommand = { user: '', body: '' } as ChatMessage;
//     //     component.checkCommand(goodCommand, component.player);
//     //     component.checkCommand(badCommand, component.player);
//     //     component.checkCommand(emptyCommand, component.player);
//     //     expect(commandHandlerSpy.handleCommand).toHaveBeenCalledTimes(1);
//     // });

//     // it('should call playerService getPlayerByName', () => {
//     //     const name = 'player';
//     //     component.getPlayerByName(name);
//     //     expect(playerSpy.getPlayerByName).toHaveBeenCalledTimes(1);
//     // });
// });
