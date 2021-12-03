import { DEFAULT_VIRTUAL_PLAYER_NAMES } from '@common/constants';
import { Difficulty, PlayerName } from '@common/player-name';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
import { VirtualPlayerNamesService } from './virtual-player-names.service';
chai.use(chaiAsPromised); // this allows us to test for rejection

describe('VirtualPlayerNamesService', () => {
    let service: VirtualPlayerNamesService;
    let databaseService: DatabaseService;
    let playerName: PlayerName;
    let client: MongoClient;
    let mongoServer: MongoMemoryServer;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        databaseService = new DatabaseService();
        client = (await databaseService.start(mongoUri)) as MongoClient;
        service = new VirtualPlayerNamesService(databaseService);
        playerName = {
            name: 'test',
            difficulty: Difficulty.Beginner,
        };
        await service.collection.insertOne(playerName);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should correctly get the player names from the database', async () => {
        const names = await service.getAllNames();
        expect(names.length).to.equal(1);
        expect(playerName).to.deep.equals(names[0]);
    });

    it('should correctly add a name to the database', async () => {
        const newName: PlayerName = { name: 'newName', difficulty: Difficulty.Beginner };
        const wasAdded = await service.addPlayer(newName);
        expect(wasAdded).to.equal(true);

        const names = await service.getAllNames();
        expect(names.length).to.equal(2);

        let containsNewName = false;
        for (const name of names) {
            if (name.name === newName.name && name.difficulty === newName.difficulty) {
                containsNewName = true;
            }
        }
        expect(containsNewName).to.equal(true);
    });

    it('should not add a players name if it is already in the database', async () => {
        const wasAdded = await service.addPlayer({ name: playerName.name, difficulty: Difficulty.Expert });
        expect(wasAdded).to.equal(false);
        const names = await service.getAllNames();
        expect(names.length).to.equal(1);
    });

    it('should return all players of same difficulty', async () => {
        const newName: PlayerName = { name: 'newName', difficulty: Difficulty.Expert };
        await service.addPlayer(newName);

        const expertPlayer = await service.getExpertPlayerNames();
        const beginnerPlayer = await service.getBeginnerPlayerNames();

        expect(expertPlayer.length).to.equal(1);
        expect(beginnerPlayer.length).to.equal(1);

        expect(expertPlayer[0]).to.deep.equal(newName);
        expect(beginnerPlayer[0]).to.deep.equal(playerName);
    });

    it('should delete a players name if it is contained in the database', async () => {
        const wasDeleted = await service.deletePlayer(playerName);
        expect(wasDeleted).to.equal(true);
        const names = await service.getAllNames();
        expect(names.length).to.equal(0);
    });

    it('should modify a player contained in the database', async () => {
        const deleted = await service.modifyPlayer(playerName, { name: 'modified', difficulty: Difficulty.Beginner });
        expect(deleted).to.equal(true);
        const names = await service.getAllNames();
        expect(names.length).to.equal(1);
        expect(names[0].name).to.equal('modified');
    });

    it('should not modify a players name if the modification will lead to two names being the same', async () => {
        const name = { name: 'newName', difficulty: Difficulty.Expert };
        await service.addPlayer(name);
        const wasModified = service.modifyPlayer(name, { name: playerName.name, difficulty: name.difficulty });
        expect(wasModified).not.to.equal(true);
        const names = await service.getAllNames();
        expect(names.find((x) => x.name === name.name)).to.deep.equal(name);
    });

    it('should remove all the player names that arent default and add all the default names', async () => {
        await service.reset();
        const names = await service.getAllNames();
        expect(names.length).to.equal(DEFAULT_VIRTUAL_PLAYER_NAMES.length);
    });

    // Error handling
    describe('Error handling', async () => {
        it('should throw an error if we try to get all names on a closed connection', async () => {
            await client.close();
            expect(service.getAllNames()).to.eventually.be.rejectedWith(Error);
        });
        it('should throw an error if we try to get expert names on a closed connection', async () => {
            await client.close();
            expect(service.getExpertPlayerNames()).to.eventually.be.rejectedWith(Error);
        });
        it('should throw an error if we try to get beginner names on a closed connection', async () => {
            await client.close();
            expect(service.getBeginnerPlayerNames()).to.eventually.be.rejectedWith(Error);
        });
        it('should throw an error if we try to add a name on a closed connection', async () => {
            await client.close();
            expect(service.addPlayer({ name: 'newName', difficulty: Difficulty.Beginner })).to.eventually.be.rejectedWith(Error);
        });
        it('should throw an error if we try to remove a name on a closed connection', async () => {
            await client.close();
            expect(service.deletePlayer(playerName)).to.eventually.be.rejectedWith(Error);
        });
        it('should throw an error if we try to modify a name on a closed connection', async () => {
            await client.close();
            expect(service.modifyPlayer(playerName, { name: 'newName', difficulty: Difficulty.Beginner })).to.eventually.be.rejectedWith(Error);
        });
    });
});
