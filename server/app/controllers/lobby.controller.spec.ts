// import { Application } from '@app/app';
// import { LobbyService } from '@app/services/lobby.service';
// import { describe } from 'mocha';
// import { createStubInstance, SinonStubbedInstance } from 'sinon';
// import { Container } from 'typedi';

// describe('LobbyController', () => {
//     let lobbyService: SinonStubbedInstance<LobbyService>;
//     // let expressApp: Express.Application;

//     beforeEach(async () => {
//         lobbyService = createStubInstance(LobbyService);
//         lobbyService.generateKey.returns('key');
//         const app = Container.get(Application);
//         Object.defineProperty(app.lobbyController, 'lobbyService', { value: lobbyService, configurable: true });
//         // expressApp = app.app;
//     });

//     it('should return lobbies on valid get request to /api/lobby', async () => {
//         // const lobby: Lobby = {
//         //     key: 'key',
//         //     config: {
//         //         host: 'host',
//         //         turnDuration: 60,
//         //         bonusEnabled: false,
//         //         dictionary: 'french',
//         //     },
//         // };
//         // lobbyService.getLobbies.returns([lobby]);
//         // return supertest(expressApp)
//         //     .get('/api/lobby')
//         //     .expect(HTTP_STATUS_OK)
//         //     .then((res) => {
//         //         expect((res.body as []).length).to.equal(1);
//         //     });
//     });

//     it('should create and store a lobby on valid put request to /api/lobby', async () => {
//         // lobbyService.createLobby.returns('key');
//         // const config: LobbyConfig = {
//         //     host: 'host',
//         //     turnDuration: 60,
//         //     bonusEnabled: false,
//         //     dictionary: 'french',
//         // };
//         // return supertest(expressApp)
//         //     .put('/api/lobby')
//         //     .send(config)
//         //     .expect(HTTP_STATUS_OK)
//         //     .then((res) => {
//         //         expect(res.body as string).to.equal({ key: 'key' });
//         //     });
//     });
// });
