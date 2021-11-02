import { Lobby, LobbyConfig } from '@common/lobby';
import { expect } from 'chai';
import { describe } from 'mocha';
import { LobbyService } from './lobby.service';

describe('LobbyController', () => {
    let lobbyService: LobbyService;

    beforeEach(async () => {
        lobbyService = new LobbyService();
    });

    it('createLobby should return the lobby key a lobby is created', () => {
        const key = 'key';
        lobbyService.generateKey = (): string => key;
        const config: LobbyConfig = {
            host: 'host',
            turnDuration: 60,
            bonusEnabled: false,
            dictionary: 'french',
        };
        expect(lobbyService.createLobby(config)).to.equal(key);
    });

    it('getLobbies returns all lobbies', () => {
        const lobby: Lobby = {
            key: 'key',
            config: {
                host: 'host',
                turnDuration: 60,
                bonusEnabled: false,
                dictionary: 'french',
            },
        };
        lobbyService.lobbies.set('lobby1', lobby);
        lobbyService.lobbies.set('lobby2', lobby);
        expect(lobbyService.getLobbies().length).to.equal(2);
    });

    it('joinLobby should return true if you join the lobby, false otherwise', () => {
        const lobby: Lobby = {
            key: 'key',
            config: {
                host: 'host',
                turnDuration: 60,
                bonusEnabled: false,
                dictionary: 'french',
            },
        };
        lobbyService.lobbies.set(lobby.key, lobby);
        expect(lobbyService.joinLobby(lobby.key)).to.equal(true);
        expect(lobbyService.joinLobby('noo')).to.equal(false);
    });

    it('getLobby should return the lobby if it exists, undefined otherwise', () => {
        const lobby: Lobby = {
            key: 'key',
            config: {
                host: 'host',
                turnDuration: 60,
                bonusEnabled: false,
                dictionary: 'french',
            },
        };
        lobbyService.lobbies.set(lobby.key, lobby);
        expect(lobbyService.getLobby(lobby.key)).to.equal(lobby);
        expect(lobbyService.getLobby('noo')).to.equal(undefined);
    });

    it('deleteLobby should delete the lobby from the list', () => {
        const lobby: Lobby = {
            key: 'key',
            config: {
                host: 'host',
                turnDuration: 60,
                bonusEnabled: false,
                dictionary: 'french',
            },
        };
        lobbyService.lobbies.set(lobby.key, lobby);
        lobbyService.deleteLobby(lobby.key);

        expect(lobbyService.lobbies.size).to.equal(0);
    });

    it('generateKey should return a string', () => {
        const key = lobbyService.generateKey();
        const expectedLength = 8;
        expect(key.length).to.equal(expectedLength);
    });
});
