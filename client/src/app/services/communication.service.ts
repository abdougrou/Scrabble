import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lobby, LobbyConfig } from '@common/lobby';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    // private socket: Socket;
    private httpOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    constructor(private readonly http: HttpClient) {}

    createLobby(creator: string, duration: number): void {
        // this.socket = io.io('https://localhost:3000');
        // eslint-disable-next-line no-console
        // console.log(`Client socket id : ${this.socket.id}`);
        // this.enableListeners();
        const lobbyConfig: LobbyConfig = {
            host: creator,
            turnDuration: duration,
            bonusEnabled: false,
            dictionary: 'french',
        };

        // this.putLobby(gameConfig);
        const obsPut = this.putLobby(lobbyConfig);
        obsPut.pipe(map((message: { key: string }) => message)).subscribe((message) => message);
    }

    // TODO remove default value for testing purposes only
    // startMultiplayerGame(playerName: string, roomId: number = 0): boolean {
    //     this.socket.emit('start multiplayer game', playerName);
    //     this.socket.emit('on user join room', playerName, roomId);
    //     return true;
    // }

    getLobbies(): Observable<Lobby[]> {
        return this.http.get<Lobby[]>('http://localhost:3000/api/lobby', this.httpOptions).pipe(catchError(this.handleError<Lobby[]>('getLobbies')));
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
