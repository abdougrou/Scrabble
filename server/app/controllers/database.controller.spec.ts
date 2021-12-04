// import { Application } from '@app/app';
// import { ClassicRankingService } from '@app/services/classic-ranking.service';
// import { DatabaseService } from '@app/services/database.service';
// import { ScoreConfig } from '@common/score-config';
// import * as chai from 'chai';
// import { expect } from 'chai';
// import * as chaiAsPromised from 'chai-as-promised';
// import { StatusCodes } from 'http-status-codes';
// import { describe } from 'mocha';
// import { MongoClient } from 'mongodb';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import * as supertest from 'supertest';
// import Container from 'typedi';
// chai.use(chaiAsPromised);

// const HTTP_STATUS_OK = StatusCodes.OK;

// describe('Database controller', () => {
//     // let classicRankingService: SinonStubbedInstance<ClassicRankingService>;
//     let expressApp: Express.Application;
//     let classicRankingService: ClassicRankingService;
//     let databaseService: DatabaseService;
//     let client: MongoClient;
//     let scoreConfig: ScoreConfig;
//     let mongoServer: MongoMemoryServer;

//     beforeEach(async () => {
//         databaseService = new DatabaseService();
//         mongoServer = await MongoMemoryServer.create();
//         const mongoUri = mongoServer.getUri();
//         client = (await databaseService.start(mongoUri)) as MongoClient;
//         classicRankingService = new ClassicRankingService(databaseService);
//         scoreConfig = {
//             name: 'Bluebery',
//             score: 90,
//         };
//         await classicRankingService.collection.insertOne(scoreConfig);
//     });

//     beforeEach(async () => {
//         // classicRankingService = createStubInstance(ClassicRankingService);
//         const app = Container.get(Application);
//         Object.defineProperty(app.databaseController, 'classicRankingService', { value: classicRankingService, configurable: true });
//         expressApp = app.app;
//     });

//     afterEach(async () => {
//         await databaseService.closeConnection();
//     });

//     it('should return lobbies on valid get request to /api/lobby', async () => {
//         return supertest(expressApp)
//             .get('/data/ranking/classic')
//             .expect(HTTP_STATUS_OK)
//             .then((res) => {
//                 console.log('res.body: ', res.body);
//                 expect((res.body as []).length).to.equal(1);
//             });
//     });
// });
