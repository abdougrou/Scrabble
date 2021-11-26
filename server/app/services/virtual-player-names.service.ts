import { HttpException } from '@app/classes/http.exception';
import { DEFAULT_VIRTUAL_PLAYER_NAMES } from '@common/constants';
import { Difficulty, PlayerName } from '@common/player-name';
import { Collection } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

const DATABASE_COLLECTION = 'virtual_player_names';

@Service()
export class VirtualPlayerNamesService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<PlayerName> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    async reset() {
        this.collection.deleteMany({});
        this.collection.insertMany(DEFAULT_VIRTUAL_PLAYER_NAMES);
    }

    async getAllNames(): Promise<PlayerName[]> {
        return this.collection
            .find({})
            .toArray()
            .then((players: PlayerName[]) => {
                return players;
            });
    }
    async getExpertPlayerNames(): Promise<PlayerName[]> {
        return this.collection
            .find({ difficulty: Difficulty.Expert })
            .toArray()
            .then((players: PlayerName[]) => {
                return players;
            });
    }
    async getBeginnerPlayerNames(): Promise<PlayerName[]> {
        return this.collection
            .find({ difficulty: Difficulty.Beginner })
            .toArray()
            .then((players: PlayerName[]) => {
                return players;
            });
    }

    async addPlayer(playerName: PlayerName): Promise<boolean> {
        if ((await this.collection.find({ name: playerName.name }).toArray()).length === 0) {
            await this.collection.insertOne(playerName).catch(() => {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                throw new HttpException('Failed to insert', 500);
            });
            return true;
        }
        return false;
    }

    async deletePlayer(playerName: PlayerName): Promise<boolean> {
        await this.collection.findOneAndDelete({ name: playerName.name }).catch(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            throw new HttpException('Failed to insert', 500);
        });
        return true;
    }

    async modifyPlayer(playerToModify: PlayerName, newName: PlayerName): Promise<boolean> {
        for (const playerName of DEFAULT_VIRTUAL_PLAYER_NAMES) {
            if (newName.name === playerName.name) {
                return false;
            }
        }
        await this.collection.findOneAndReplace({ name: playerToModify.name }, newName).catch(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            throw new HttpException('Failed to update', 500);
        });
        return true;
    }
}
