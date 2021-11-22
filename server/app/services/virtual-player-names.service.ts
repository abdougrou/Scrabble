import { HttpException } from '@app/classes/http.exception';
import { DEFAULT_VIRTUAL_PLAYER_NAMES } from '@app/constants';
import { PlayerName } from '@common/player-name';
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

    async addPlayer(playerName: PlayerName): Promise<void> {
        await this.collection.insertOne(playerName).catch(() => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            throw new HttpException('Failed to insert', 500);
        });
    }
}
