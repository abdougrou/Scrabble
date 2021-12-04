import { HttpStatusCode } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GameMode } from '@app/classes/game-config';
// eslint-disable-next-line no-restricted-imports
import { SocketMock } from '@app/classes/socket-test-helper';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryInfo } from '@common/dictionaryTemplate';
import { LobbyConfig } from '@common/lobby-config';
import { Difficulty, PlayerName } from '@common/player-name';
import { ScoreConfig } from '@common/score-config';
import { SetConfigMessage } from '@common/socket-messages';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
// import SpyObj = jasmine.SpyObj;

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let socketMock: SocketMock;

    const expectedLobbies: LobbyConfig[] = [
        {
            key: '',
            host: 'abdou',
            turnDuration: 60,
            bonusEnabled: false,
            dictionary: 'francais',
            gameMode: GameMode.Classic,
        },
        {
            key: '',
            host: 'khalil',
            turnDuration: 70,
            bonusEnabled: false,
            dictionary: 'francais',
            gameMode: GameMode.Classic,
        },
    ];
    const expectedScoreConfig: ScoreConfig[] = [
        {
            name: 'nikolay',
            score: 5,
        },
        {
            name: 'joe',
            score: 10,
        },
    ];
    const expectedPlayerName: PlayerName[] = [
        {
            name: 'khalil',
            difficulty: Difficulty.Beginner,
        },
        {
            name: 'taha',
            difficulty: Difficulty.Expert,
        },
    ];
    const expectedDictionnaryInfo: DictionaryInfo[] = [
        {
            title: 'francais',
            description: 'un dictionnaire frncais',
        },
        {
            title: 'anglais',
            description: 'un dictionnaire anglais',
        },
    ];
    const lobby: LobbyConfig = {
        host: 'abdou',
        turnDuration: 60,
        bonusEnabled: false,
        dictionary: 'francais',
        gameMode: GameMode.Classic,
    };

    beforeEach(() => {
        socketMock = new SocketMock();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: Socket, useValue: socketMock }],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all lobbies', () => {
        // check the content of the mocked call
        service.getLobbies().subscribe((response) => {
            expect(response).toBe(expectedLobbies);
        }, fail);

        const req = httpMock.expectOne(`${environment.serverUrl}/api/lobby`);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedLobbies);
    });
    it('should create a lobby and get the key associated', () => {
        const expectedKey = { key: 'abc123' };
        service.putLobby(expectedLobbies[0]).subscribe((key) => {
            expect(key).toBe(expectedKey);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/api/lobby`);
        expect(req.request.method).toBe('PUT');
        req.flush(expectedKey);
    });
    it('should get classic rank', () => {
        service.getClassicRanking().subscribe((score) => {
            expect(score).toBe(expectedScoreConfig);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/ranking/classic`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedScoreConfig);
    });
    it('should get log2990 rank', () => {
        service.getLog2990Ranking().subscribe((score) => {
            expect(score).toBe(expectedScoreConfig);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/ranking/log2990`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedScoreConfig);
    });
    it('should get the right status for postClassic', () => {
        service.putClassicPlayerScore(expectedScoreConfig[0]).subscribe((response) => {
            expect(response).toBe(HttpStatusCode.Created);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/ranking/classic`);
        expect(req.request.method).toBe('POST');
        req.flush(HttpStatusCode.Created);
    });
    it('should get the right status for postLog2990', () => {
        service.putLog2990PlayerScore(expectedScoreConfig[0]).subscribe((response) => {
            expect(response).toBe(HttpStatusCode.Created);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/ranking/log2990`);
        expect(req.request.method).toBe('POST');
        req.flush(HttpStatusCode.Created);
    });
    it('should get the right status when resetting score', () => {
        service.resetPlayerScores().subscribe((response) => {
            expect(response).toBe(HttpStatusCode.NoContent);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/ranking/reset`);
        expect(req.request.method).toBe('DELETE');
        req.flush(HttpStatusCode.NoContent);
    });
    it('should get the player name', () => {
        service.getPlayerNames().subscribe((names) => {
            expect(names).toBe(expectedPlayerName);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/player-names`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedPlayerName);
    });
    it('should get expert name', () => {
        service.getExpertPlayerNames().subscribe((names) => {
            expect(names).toBe(expectedPlayerName);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/player-names/expert`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedPlayerName);
    });
    it('should get beginner name', () => {
        service.getBeginnerPlayerNames().subscribe((names) => {
            expect(names).toBe(expectedPlayerName);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/player-names/beginner`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedPlayerName);
    });
    it('should add player name', () => {
        service.addPlayerName(expectedPlayerName[0]).subscribe((response) => {
            expect(response).toBeTrue();
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/player-names`);
        expect(req.request.method).toBe('POST');
        req.flush(true);
    });
    it('should delete player name', () => {
        service.deletePlayerName(expectedPlayerName[0]).subscribe((response) => {
            expect(response).toBeFalse();
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/player-names/delete`);
        expect(req.request.method).toBe('POST');
        req.flush(false);
    });
    it('should get the right status for resetting name', () => {
        service.resetPlayerNames().subscribe((response) => {
            expect(response).toBe(HttpStatusCode.NoContent);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/player-names/reset`);
        expect(req.request.method).toBe('DELETE');
        req.flush(HttpStatusCode.NoContent);
    });
    it('should get the right status when resetting dictionnary', () => {
        service.resetDictionary().subscribe((response) => {
            expect(response).toBe(HttpStatusCode.NoContent);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/dictionary/reset`);
        expect(req.request.method).toBe('DELETE');
        req.flush(HttpStatusCode.NoContent);
    });
    it('should modify player name', () => {
        service.modifyPlayerName(expectedPlayerName[0], expectedPlayerName[1]).subscribe((response) => {
            expect(response).toBeTrue();
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/player-names/modify`);
        expect(req.request.method).toBe('POST');
        req.flush(true);
    });
    it('should get dictionnary info', () => {
        service.getDictionaryInfo().subscribe((dictionnary) => {
            expect(dictionnary).toBe(expectedDictionnaryInfo);
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/dictionary`);
        expect(req.request.method).toBe('GET');
        req.flush(expectedDictionnaryInfo);
    });
    it('should modify dictionary info', () => {
        service.modifyDictionary(expectedDictionnaryInfo[0].title, expectedDictionnaryInfo[1]).subscribe((response) => {
            expect(response).toBeTrue();
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/dictionary/modify`);
        expect(req.request.method).toBe('POST');
        req.flush(true);
    });
    it('should delete dictionary', () => {
        service.deleteDictionary(expectedDictionnaryInfo[0]).subscribe((response) => {
            expect(response).toBeTrue();
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/dictionary/delete`);
        expect(req.request.method).toBe('POST');
        req.flush(true);
    });
    it('should get dictionary file', () => {
        service.getDictionaryFile(expectedDictionnaryInfo[0]).subscribe((response) => {
            expect(response).toBe('dictionnaire');
        });
        const req = httpMock.expectOne(`${environment.serverUrl}/data/dictionary/file`);
        expect(req.request.method).toBe('POST');
        req.flush('dictionnaire');
    });
    it('should emit switch player', () => {
        const spy = spyOn(service.socket, 'emit');
        service.switchPlayers();
        expect(spy).toHaveBeenCalled();
    });
    it('should update gameManager', () => {
        const spy = spyOn(service.socket, 'emit');
        service.deleteLobby('abc123');
        expect(spy).toHaveBeenCalled();
    });
    // it('should send a message', () => {
    //     const message: ChatMessage = {
    //         user: 'abou',
    //         body: 'allo',
    //     };
    //     const spy = spyOn(service.socket, 'emit');
    //     const spy1 = spyOn(service.socket, 'on');
    //     service.sendMessage(message);
    //     expect(spy).toHaveBeenCalled();
    //     expect(spy1).toHaveBeenCalled();
    // });
    it('should setconfig', () => {
        const spy = spyOn(service.socket, 'on');
        service.setConfig(lobby, 'guest');
        expect(spy).toHaveBeenCalled();
    });
    it('should call join lobby when the method create lobby is called', async () => {
        const key = 'testKey';
        spyOn(service, 'putLobby').and.returnValue(of({ key }));
        const spy = spyOn(service, 'joinLobby').and.returnValue();
        service.createLobby(lobby);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit and call getLobbies method when we call delete lobby', () => {
        const key = 'testKey';
        const socketSpy = spyOn(service.socket, 'emit');
        const getLobbiesSpy = spyOn(service, 'getLobbies');
        service.deleteLobby(key);
        expect(socketSpy).toHaveBeenCalled();
        expect(getLobbiesSpy).toHaveBeenCalled();
    });
    it('should emit', () => {
        const onSpy = spyOn(service.socket, 'on').and.callThrough();
        const message: SetConfigMessage = {
            lobbyKey: 'abc',
            config: lobby,
            guest: 'moi',
        };
        service.setConfig(lobby, 'sam');
        socketMock.emit('start game', message);
        expect(onSpy).toHaveBeenCalled();
    });
});
