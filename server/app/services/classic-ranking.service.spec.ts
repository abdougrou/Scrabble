import { ScoreConfig } from '@common/score-config';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ClassicRankingService } from './classic-ranking.service';
import { DatabaseService } from './database.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Classic ranking service', () => {
    let classicRankingService: ClassicRankingService;
    let databaseService: DatabaseService;
    let client: MongoClient;
    let scoreConfig: ScoreConfig;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        databaseService = new DatabaseService();
        client = (await databaseService.start(mongoUri)) as MongoClient;
        classicRankingService = new ClassicRankingService(databaseService);
        scoreConfig = {
            name: 'Bluebery',
            score: 90,
        };
        await classicRankingService.collection.insertOne(scoreConfig);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all courses from DB', async () => {
        const players = await classicRankingService.getAllPlayers();
        expect(players.length).to.equal(1);
        expect(scoreConfig).to.deep.equals(players[0]);
    });

    it('should insert a new course', async () => {
        const secondPlayer: ScoreConfig = {
            name: 'Jean',
            score: 28,
        };

        await classicRankingService.addPlayer(secondPlayer);
        const players = await classicRankingService.collection.find({}).toArray();
        expect(players.length).to.equal(2);
        expect(players.find((x) => x.name === secondPlayer.name)).to.deep.equals(secondPlayer);
    });

    it('should not insert a new course if it has an invalid subjectCode and credits', async () => {
        const secondPlayer: ScoreConfig = {
            name: 'Jean',
            score: -1,
        };
        try {
            await classicRankingService.addPlayer(secondPlayer);
        } catch {
            const players = await classicRankingService.collection.find({}).toArray();
            expect(players.length).to.equal(1);
        }
    });

    it('deleteLowestplayer should delete the lowest scored player', async () => {
        await classicRankingService.deleteLowestPlayer();
        const players = await classicRankingService.collection.find({}).toArray();
        expect(players.length).to.equal(0);
    });

    it('reset should reset the database to its default values', async () => {
        await classicRankingService.reset();
        const players = await classicRankingService.collection.find({}).toArray();
        expect(players.length).to.equal(5);
    });

    it('adding a player after max size should delete the lowest', async () => {
        const player: ScoreConfig = {
            name: 'Jean',
            score: 100,
        };
        await classicRankingService.reset();
        await classicRankingService.addPlayer(player);
        const players = await classicRankingService.collection.find({}).toArray();
        expect(players.length).to.equal(5);
    });

    it('Validate player should return true if max size isnt reached ', async () => {
        const player: ScoreConfig = {
            name: 'Jean',
            score: 100,
        };
        expect(await classicRankingService.validatePlayer(player)).to.equal(true);
    });

    // Error handling
    describe('Error handling', async () => {
        it('should throw an error if we try to get all players on a closed connection', async () => {
            await client.close();
            expect(classicRankingService.getAllPlayers()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to delete lowest player', async () => {
            await client.close();
            expect(classicRankingService.deleteLowestPlayer()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get all players when connection closed', async () => {
            await client.close();
            const newCourse = {
                name: 'John Doe',
                score: 7,
            };
            expect(classicRankingService.addPlayer(newCourse)).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to add a player with invalid values', async () => {
            await client.close();
            const newPlayer = {
                name: 'sdf',
                score: -1,
            };
            expect(classicRankingService.addPlayer(newPlayer)).to.eventually.be.rejectedWith(Error);
        });
    });
});
