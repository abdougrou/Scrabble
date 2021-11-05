/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Lobby } from '@app/classes/lobby';
import { LobbyConfig } from '@common/lobby-config';
import { expect } from 'chai';
import { describe } from 'mocha';
import { LobbyService } from './lobby.service';

describe('LobbyService', () => {
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
        const lobby: LobbyConfig = {
            key: 'key',
            host: 'host',
            turnDuration: 60,
            bonusEnabled: false,
            dictionary: 'french',
        };
        lobbyService.lobbies.set('lobby1', new Lobby(lobby.key!, lobby));
        lobbyService.lobbies.set('lobby2', new Lobby(lobby.key!, lobby));
        expect(lobbyService.getLobbies().length).to.equal(2);
    });

    it('playerJoinLobby should return true if the player joins the lobby, false otherwise', () => {
        const lobby: LobbyConfig = {
            key: 'key',
            host: 'host',
            turnDuration: 60,
            bonusEnabled: false,
            dictionary: 'french',
        };
        lobbyService.lobbies.set(lobby.key!, new Lobby(lobby.key!, lobby));
        expect(lobbyService.playerJoinLobby('player1', lobby.key!)).to.equal(true);
        expect(lobbyService.playerJoinLobby('player2', lobby.key!)).to.equal(true);
        expect(lobbyService.playerJoinLobby(lobby.host, 'noo')).to.equal(false);
        expect(lobbyService.playerJoinLobby('player3', 'no lobby')).to.equal(false);
    });

    it('playerLeaveLobby should return true when the player is removed from the lobby, false otherwise', () => {
        const lobby: LobbyConfig = {
            key: 'key',
            host: 'host',
            turnDuration: 60,
            bonusEnabled: false,
            dictionary: 'french',
        };
        const player1 = 'player1';
        const player2 = 'player2';
        lobbyService.lobbies.set(lobby.key!, new Lobby(lobby.key!, lobby));
        lobbyService.playerJoinLobby(player1, lobby.key!);
        lobbyService.playerJoinLobby(player2, lobby.key!);
        expect(lobbyService.playerLeaveLobby(player1, lobby.key!)).to.equal(true);
        expect(lobbyService.lobbies.size).to.equal(1);
        expect(lobbyService.playerLeaveLobby(player2, lobby.key!)).to.equal(true);
        expect(lobbyService.lobbies.size).to.equal(0);
        expect(lobbyService.playerLeaveLobby('player3', 'noo')).to.equal(false);
    });

    it('getLobby should return the lobby if it exists, undefined otherwise', () => {
        const lobby: LobbyConfig = {
            key: 'key',
            host: 'host',
            turnDuration: 60,
            bonusEnabled: false,
            dictionary: 'french',
        };
        lobbyService.lobbies.set(lobby.key!, new Lobby(lobby.key!, lobby));
        expect(lobbyService.getLobby(lobby.key!)?.config).to.equal(lobby);
        expect(lobbyService.getLobby('noo')).to.equal(undefined);
    });

    it('deleteLobby should delete the lobby from the list', () => {
        const lobby: LobbyConfig = {
            key: 'key',
            host: 'host',
            turnDuration: 60,
            bonusEnabled: false,
            dictionary: 'french',
        };
        lobbyService.lobbies.set(lobby.key!, new Lobby(lobby.key!, lobby));
        lobbyService.deleteLobby(lobby.key!);

        expect(lobbyService.lobbies.size).to.equal(0);
    });

    it('generateKey should return a string', () => {
        const key = lobbyService.generateKey();
        const expectedLength = 8;
        expect(key.length).to.equal(expectedLength);
    });
});
