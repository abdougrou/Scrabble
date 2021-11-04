import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LobbyConfig } from '@common/lobby-config';
import { JoinLobbyMessage, LeaveLobbyMessage, SocketEvent } from '@common/socket-messages';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    lobbyKey: string;
    private socket: io.Socket;
    private httpOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    constructor(private readonly http: HttpClient) {
        this.socket = io.io('ws://localhost:3000');
    }

    createLobby(config: LobbyConfig): string {
        const obsPut = this.putLobby(config);
        obsPut.pipe(map((message: { key: string }) => message)).subscribe((message) => {
            this.joinLobby(message.key);
        });
        return this.lobbyKey;
    }

    joinLobby(key: string) {
        this.lobbyKey = key;
        this.socket.emit(SocketEvent.playerJoinLobby, { lobbyKey: key, playerName: 'PLAYER_NAME' } as JoinLobbyMessage);
    }

    leaveLobby() {
        this.socket.emit(SocketEvent.playerLeaveLobby, { lobbyKey: this.lobbyKey, playerName: 'PLAYER_NAME' } as LeaveLobbyMessage);
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

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
