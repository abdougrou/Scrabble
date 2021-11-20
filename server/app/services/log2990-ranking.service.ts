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
        if (this.validateScoreConfig(playerscore)) {
            if (await this.validateSize()) {
                if (await this.validatePlayer(playerscore)) this.deleteLowestPlayer();
            }
            await this.collection.insertOne(playerscore).catch((error: Error) => {
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                throw new HttpException('Failed to insert', 500);
            });
        } else {
            throw new Error('Invalid');
        }
    }

    async deleteLowestPlayer(): Promise<void> {
        this.collection
            .find()
            .sort({ score: 1 })
            .limit(1)
            .toArray()
            .then(async (players: ScoreConfig[]) => {
                console.log('lowestplayer', players[0]);
                return this.collection.findOneAndDelete({ score: players[0].score });
            });
    }

    private async validatePlayer(player: ScoreConfig): Promise<boolean> {
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

    private async validateSize() {
        dataSize = await this.collection.find({}).count();
        return dataSize < MAX;
    }

    private validateScoreConfig(player: ScoreConfig) {
        return player.score >= 0 && player.name !== undefined && player.name !== '' && player.name && player !== undefined;
    }
}
