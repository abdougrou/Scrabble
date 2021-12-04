import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { ChatMessage } from '@app/classes/message';
import { Objective } from '@app/classes/objective';
import { Player } from '@app/classes/player';
import { DictionaryInfo } from '@common/dictionaryTemplate';
import { FileTemplate } from '@common/fileTemplate';
import { GameMode, LobbyConfig } from '@common/lobby-config';
import { PlayerName } from '@common/player-name';
import { ScoreConfig } from '@common/score-config';
import {
    ContinueSoloMessage,
    DeleteLobbyMessage,
    ExchangeLettersMessage,
    JoinLobbyMessage,
    LeaveLobbyMessage,
    NormalChatMessage,
    PlaceLettersMessage,
    SetConfigMessage,
    ShowReserveMessage,
    SkipTurnMessage,
    SocketEvent,
    SwitchPlayersMessage,
    UpdateGameManagerMessage,
    UpdateMessage,
} from '@common/socket-messages';
import { Vec2 } from '@common/vec2';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    lobbyKey: string;
    playerName: string;
    started = false;
    config: LobbyConfig;
    gameManager: MultiplayerGameManagerService;
    guestName: string;
    serverMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject({ user: '', body: '' });
    private socket: io.Socket;
    private httpOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    constructor(private readonly http: HttpClient, private playerService: PlayerService) {
        this.socket = io.io('ws://localhost:3000');

        this.socket.on(SocketEvent.setTimer, () => {
            this.gameManager.turnDurationLeft = this.gameManager.lobbyConfig.turnDuration;
        });
        this.socket.on(SocketEvent.update, (gameManager: UpdateGameManagerMessage) => {
            /* for (const serverPlayer of gameManager.players) {
                const player: Player = { name: serverPlayer.name, score: serverPlayer.score, easel: new Easel(serverPlayer.easel.split(',')) };
                this.gameManager.player.players[playerIndex] = player;
                playerIndex++;
            }*/
            this.playerService.players = gameManager.players;
            this.playerService.players.forEach((player) => (player.easel = new Easel(player.easel.letters)));
            this.gameManager.reserve.data = gameManager.reserveData;
            this.gameManager.reserve.size = gameManager.reserveCount;
            this.gameManager.board.data = gameManager.boardData;
            this.gameManager.gridService.drawBoard();
            this.gameManager.emitChanges();
        });
        this.socket.on(SocketEvent.chatMessage, (msg) => {
            this.serverMessage.next({ user: msg.split(':')[0].trim(), body: msg.split(':')[1] });
        });
    }

    continueSolo(): Observable<ContinueSoloMessage> {
        return new Observable((subscriber) => {
            this.socket.on(SocketEvent.continueSolo, (message: ContinueSoloMessage) => {
                subscriber.next(message);
            });
        });
    }

    connectionSuccesful(): boolean {
        return this.socket.connected;
    }

    setGameManager(gameManager: MultiplayerGameManagerService) {
        this.gameManager = gameManager;
    }

    createLobby(config: LobbyConfig): string {
        const obsPut = this.putLobby(config);
        obsPut.pipe(map((message: { key: string }) => message)).subscribe((message) => {
            this.joinLobby(message.key, config.host);
        });
        return this.lobbyKey;
    }

    deleteLobby(key: string) {
        this.socket.emit(SocketEvent.deleteLobby, { lobbyKey: key } as DeleteLobbyMessage);
        this.getLobbies();
    }

    joinLobby(key: string, playerName: string) {
        this.lobbyKey = key;
        this.playerName = playerName;
        this.socket.emit(SocketEvent.playerJoinLobby, { lobbyKey: key, playerName } as JoinLobbyMessage);
    }

    setConfig(config: LobbyConfig, guestName: string) {
        config.key = this.lobbyKey;
        this.socket.emit(SocketEvent.setConfig, { lobbyKey: this.lobbyKey, config, guest: guestName } as SetConfigMessage);
        this.socket.on('start game', (message: SetConfigMessage) => {
            this.started = true;
            this.config = message.config;
            this.guestName = message.guest;
            this.playerService.players = message.players as Player[];
            if (this.config.gameMode === GameMode.LOG2990) this.gameManager.objectivesService.objectives = message.objectives as Objective[];
        });
    }

    setPlayers() {
        this.update();
    }

    update() {
        this.socket.emit(SocketEvent.update, { lobbyKey: this.lobbyKey } as UpdateMessage);
        // let playerIndex = 0;
        this.socket.on(SocketEvent.update, (gameManager: UpdateGameManagerMessage) => {
            /* for (const serverPlayer of gameManager.players) {
                const player: Player = { name: serverPlayer.name, score: serverPlayer.score, easel: new Easel(serverPlayer.easel.split(',')) };
                this.gameManager.player.players[playerIndex] = player;
                playerIndex++;
            }*/
            this.playerService.players = gameManager.players;
            this.gameManager.reserve.data = gameManager.reserveData;
            this.gameManager.reserve.size = gameManager.reserveCount;
            this.gameManager.board.data = gameManager.boardData;
            this.gameManager.gridService.drawBoard();
            this.gameManager.emitChanges();
        });
    }

    switchPlayers() {
        this.socket.emit(SocketEvent.switchPlayers, { lobbyKey: this.lobbyKey } as SwitchPlayersMessage);
    }

    exchangeLetters(letters: string, player: Player) {
        const playerData = { name: player.name, score: player.score, easel: player.easel.toString() };
        this.socket.emit(SocketEvent.exchangeLetters, { lobbyKey: this.lobbyKey, playerData, letters } as ExchangeLettersMessage);
    }

    placeLetters(player: Player, word: string, coord: Vec2, across: boolean) {
        const playerData = { name: player.name, score: player.score, easel: player.easel.toString() };
        this.socket.emit(SocketEvent.placeLetters, { lobbyKey: this.lobbyKey, playerData, word, coord, across } as PlaceLettersMessage);
    }

    skipTurn(player: Player) {
        const playerData = { name: player.name, score: player.score, easel: player.easel.toString() };
        this.socket.emit(SocketEvent.skipTurn, { lobbyKey: this.lobbyKey, playerData } as SkipTurnMessage);
    }

    showReserve() {
        this.socket.emit(SocketEvent.reserve, { lobbyKey: this.lobbyKey } as ShowReserveMessage);
    }

    sendMessage(message: ChatMessage) {
        this.socket.emit(SocketEvent.chatMessage, { lobbyKey: this.lobbyKey, playerName: message.user, message: message.body } as NormalChatMessage);
    }

    leaveLobby() {
        this.socket.emit(SocketEvent.playerLeaveLobby, { lobbyKey: this.lobbyKey, playerName: this.playerName } as LeaveLobbyMessage);
    }

    // TODO remove default value for testing purposes only
    // startMultiplayerGame(playerName: string, roomId: number = 0): boolean {
    //     this.socket.emit('start multiplayer game', playerName);
    //     this.socket.emit('on user join room', playerName, roomId);
    //     return true;
    // }

    getLobbies(): Observable<LobbyConfig[]> {
        return this.http
            .get<LobbyConfig[]>('http://localhost:3000/api/lobby', this.httpOptions)
            .pipe(catchError(this.handleError<LobbyConfig[]>('getLobbies')));
    }

    putLobby(lobbyConfig: LobbyConfig): Observable<{ key: string }> {
        return this.http
            .put<{ key: string }>('http://localhost:3000/api/lobby', lobbyConfig, this.httpOptions)
            .pipe(catchError(this.handleError<{ key: string }>('putLobby')));
    }

    getClassicRanking(): Observable<ScoreConfig[]> {
        return this.http
            .get<ScoreConfig[]>('http://localhost:3000/data/ranking/classic', this.httpOptions)
            .pipe(catchError(this.handleError<ScoreConfig[]>('getClassicRanking')));
    }

    getLog2990Ranking(): Observable<ScoreConfig[]> {
        return this.http
            .get<ScoreConfig[]>('http://localhost:3000/data/ranking/log2990', this.httpOptions)
            .pipe(catchError(this.handleError<ScoreConfig[]>('getClassicRanking')));
    }

    putClassicPlayerScore(scoreConfig: ScoreConfig): Observable<unknown> {
        return this.http.post('http://localhost:3000/data/ranking/classic', scoreConfig, this.httpOptions);
    }

    putLog2990PlayerScore(scoreConfig: ScoreConfig): Observable<unknown> {
        return this.http.post('http://localhost:3000/data/ranking/log2990', scoreConfig, this.httpOptions);
    }

    resetPlayerScores(): Observable<unknown> {
        return this.http.delete('http://localhost:3000/data/ranking/reset', this.httpOptions);
    }

    getPlayerNames(): Observable<PlayerName[]> {
        return this.http
            .get<PlayerName[]>('http://localhost:3000/data/player-names', this.httpOptions)
            .pipe(catchError(this.handleError<PlayerName[]>('getPlayerNames')));
    }
    getExpertPlayerNames(): Observable<PlayerName[]> {
        return this.http
            .get<PlayerName[]>('http://localhost:3000/data/player-names/expert', this.httpOptions)
            .pipe(catchError(this.handleError<PlayerName[]>('getPlayerNames')));
    }
    getBeginnerPlayerNames(): Observable<PlayerName[]> {
        return this.http
            .get<PlayerName[]>('http://localhost:3000/data/player-names/beginner', this.httpOptions)
            .pipe(catchError(this.handleError<PlayerName[]>('getPlayerNames')));
    }

    // addPlayerName(playerName: PlayerName) {
    //     this.http.post('http://localhost:3000/data/player-names', JSON.stringify(playerName), this.httpOptions);
    // }

    addPlayerName(playerName: PlayerName): Observable<boolean> {
        return this.http
            .post<boolean>('http://localhost:3000/data/player-names', playerName, this.httpOptions)
            .pipe(catchError(this.handleError<boolean>('postPlayerName')));
    }

    deletePlayerName(playerName: PlayerName): Observable<boolean> {
        return this.http
            .post<boolean>('http://localhost:3000/data/player-names/delete', playerName, this.httpOptions)
            .pipe(catchError(this.handleError<boolean>('deletePlayerName')));
    }

    resetPlayerNames(): Observable<unknown> {
        return this.http.delete('http://localhost:3000/data/player-names/reset', this.httpOptions);
    }

    resetDictionary() {
        return this.http.delete('http://localhost:3000/data/dictionary/reset');
    }

    postFile(fileTemplate: FileTemplate): Observable<HttpEvent<boolean>> {
        return this.http.post<boolean>('http://localhost:3000/data/dictionary', fileTemplate, {
            reportProgress: true,
            observe: 'events',
        });
    }
    modifyPlayerName(playerName: PlayerName, newName: PlayerName): Observable<boolean> {
        const playerNames: PlayerName[] = [playerName, newName];
        return this.http
            .post<boolean>('http://localhost:3000/data/player-names/modify', playerNames, this.httpOptions)
            .pipe(catchError(this.handleError<boolean>('modifyPlayerName')));
    }

    getDictionaryInfo(): Observable<DictionaryInfo[]> {
        return this.http
            .get<DictionaryInfo[]>('http://localhost:3000/data/dictionary', this.httpOptions)
            .pipe(catchError(this.handleError<DictionaryInfo[]>('getDictionaryNames')));
    }

    modifyDictionary(dictionaryToModify: string, newDictionaryInfo: DictionaryInfo): Observable<boolean> {
        return this.http
            .post<boolean>('http://localhost:3000/data/dictionary/modify', [dictionaryToModify, newDictionaryInfo], this.httpOptions)
            .pipe(catchError(this.handleError<boolean>('modifyDictionary')));
    }

    deleteDictionary(dictionary: DictionaryInfo): Observable<boolean> {
        return this.http
            .post<boolean>('http://localhost:3000/data/dictionary/delete', dictionary, this.httpOptions)
            .pipe(catchError(this.handleError<boolean>('deleteDictionary')));
    }

    getDictionaryFile(dictionaryName: DictionaryInfo): Observable<string> {
        return this.http
            .post<string>('http://localhost:3000/data/dictionary/file', dictionaryName, this.httpOptions)
            .pipe(catchError(this.handleError<string>('deleteDictionary')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
