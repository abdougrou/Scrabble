import { ScoreConfig } from '@common/score-config';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
import { Log2990RankingService } from './log2990-ranking.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Log2990 ranking service', () => {
    let log2990RankingService: Log2990RankingService;
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
        log2990RankingService = new Log2990RankingService(databaseService);
        scoreConfig = {
            name: 'Bluebery',
            score: 90,
        };
        await log2990RankingService.collection.insertOne(scoreConfig);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all courses from DB', async () => {
        const courses = await log2990RankingService.getAllPlayers();
        expect(courses.length).to.equal(1);
        expect(scoreConfig).to.deep.equals(courses[0]);
    });

    it('should insert a new course', async () => {
        const secondCourse: ScoreConfig = {
            name: 'Jean',
            score: 28,
        };

        await log2990RankingService.addPlayer(secondCourse);
        const courses = await log2990RankingService.collection.find({}).toArray();
        expect(courses.length).to.equal(2);
        expect(courses.find((x) => x.name === secondCourse.name)).to.deep.equals(secondCourse);
    });

    it('should not insert a new course if it has an invalid subjectCode and credits', async () => {
        const secondCourse: ScoreConfig = {
            name: 'Jean',
            score: -1,
        };
        try {
            await log2990RankingService.addPlayer(secondCourse);
        } catch {
            const courses = await log2990RankingService.collection.find({}).toArray();
            expect(courses.length).to.equal(1);
        }
    });

    it('should delete an existing course data if a valid subjectCode is sent', async () => {
        await log2990RankingService.deleteLowestPlayer();
        const courses = await log2990RankingService.collection.find({}).toArray();
        console.log(courses);
        expect(courses.length).to.equal(0);
    });

    // Error handling
    describe('Error handling', async () => {
        it('should throw an error if we try to get all courses on a closed connection', async () => {
            await client.close();
            expect(log2990RankingService.getAllPlayers()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to delete a specific course on a closed connection', async () => {
            await client.close();
            expect(log2990RankingService.deleteLowestPlayer()).to.eventually.be.rejectedWith(Error);
        });

        it('should throw an error if we try to get all courses of a specific teacher on a closed connection', async () => {
            await client.close();
            const newCourse = {
                name: 'John Doe',
                score: 7,
            };
            expect(log2990RankingService.addPlayer(newCourse)).to.eventually.be.rejectedWith(Error);
        });
    });
});
