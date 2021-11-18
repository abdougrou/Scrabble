import { HttpException } from '@app/classes/http.exception';
import { DEFAULT_SCOREBOARD } from '@app/constants';
import { ScoreConfig } from '@common/score-config';
import { Collection } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

const DATABASE_COLLECTION = 'log2990_ranking';
const MAX = 5;
let dataSize = 0;

@Service()
export class Log2990RankingService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<ScoreConfig> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    async reset() {
        this.collection.deleteMany({});
        this.collection.insertMany(DEFAULT_SCOREBOARD);
    }

    /**
     *
     * @returns all data in the database collection sorted highest first
     */
    async getAllPlayers(): Promise<ScoreConfig[]> {
        return this.collection
            .find({})
            .sort({ score: -1 })
            .limit(MAX)
            .toArray()
            .then((players: ScoreConfig[]) => {
                return players;
            });
    }

    /**
     *
     * @param player player's name
     * @returns player's score template
     */
    async getPlayerByName(player: string): Promise<ScoreConfig> {
        // NB: This can return null if the course does not exist, you need to handle it
        return this.collection.findOne({ name: player }).then((playerscore: ScoreConfig) => {
            return playerscore;
        });
    }

    /**
     *
     * @param playerscore player's score template. including name and score
     */
    async addPlayer(playerscore: ScoreConfig): Promise<void> {
        if (playerscore) {
            if (this.validateSize()) {
                await this.collection.insertOne(playerscore).catch((error: Error) => {
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    throw new HttpException('Failed to insert', 500);
                });
            } else if (await this.validatePlayer(playerscore)) this.replaceLowestPlayer(playerscore);
        } else {
            throw new Error('Invalid');
        }
        this.updateSize();
    }

    async deletePlayerByName(player: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ name: player })
            .then((res) => {
                if (!res.value) {
                    throw new Error('Could not find course');
                }
            })
            .catch(() => {
                throw new Error('Failed to delete course');
            });
    }

    async replaceLowestPlayer(player: ScoreConfig): Promise<void> {
        // Can also use replaceOne if we want to replace the entire object
        return this.collection
            .findOneAndReplace({ score: { $min: '$score' } }, { name: player.name, score: player.score })
            .then(() => {})
            .catch(() => {
                throw new Error('Failed to update document');
            });
    }

    async deleteLowestPlayer(): Promise<void> {
        this.collection
            .find()
            .sort({ score: 1 })
            .limit(1)
            .toArray()
            .then(async (players: ScoreConfig[]) => {
                console.log('lowstplayer', players[0]);
                return await this.collection.findOneAndDelete({ score: players[0].score });
            });
    }

    private async validatePlayer(player: ScoreConfig): Promise<boolean> {
        this.updateSize();
        console.log('datasize:', dataSize);
        if ((dataSize = MAX))
            return this.collection
                .find()
                .sort({ score: 1 })
                .limit(1)
                .toArray()
                .then((players: ScoreConfig[]) => {
                    console.log('lowest score:', players[0]);
                    return players[0].score < player.score;
                });
        else return true;
    }

    private async updateSize() {
        dataSize = await this.collection.find({}).count();
    }

    private validateSize() {
        return dataSize < MAX;
    }
}
