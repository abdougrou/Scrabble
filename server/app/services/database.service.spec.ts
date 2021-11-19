import { DEFAULT_SCOREBOARD } from '@app/constants';
import { fail } from 'assert';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        if (databaseService.client) {
            await databaseService.client.close();
        }
    });

    // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
    it('should connect to the database when start is called', async () => {
        // Reconnect to local server
        const mongoUri = mongoServer.getUri();
        await databaseService.start(mongoUri);
        expect(databaseService.client).to.not.equal(undefined);
        expect(databaseService.db.databaseName).to.equal('scrabble');
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        // Try to reconnect to local server
        try {
            await databaseService.start('WRONG URL');
            fail();
        } catch {
            expect(databaseService.client).to.be.equal(undefined);
        }
    });

    // it('should no longer be connected if close is called', async () => {
    //     const mongoUri = await mongoServer.getUri();
    //     await databaseService.start(mongoUri);
    //     await databaseService.closeConnection();
    //     expect(databaseService.client.isConnected()).to.be.equal(false);
    // });

    it('should populate the database with a helper function', async () => {
        const mongoUri = mongoServer.getUri();
        const client = await MongoClient.connect(mongoUri, {});
        databaseService.db = client.db('database');
        await databaseService.database.collection('classic_ranking').insertMany(DEFAULT_SCOREBOARD);
        const courses = await databaseService.database.collection('classic_ranking').find({}).toArray();
        expect(courses.length).to.equal(5);
    });
});
