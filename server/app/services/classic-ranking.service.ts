import { HttpException } from '@app/classes/http.exception';
import { DEFAULT_SCOREBOARD } from '@app/constants';
import { ScoreConfig } from '@common/score-config';
import { Collection, ModifyResult } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

const DATABASE_COLLECTION = 'classic_ranking';
const MAX = 5;
@Service()
export class ClassicRankingService {
    dataSize = 0;
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<ScoreConfig> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    async reset() {
        this.collection.deleteMany({});
        this.collection.insertMany(DEFAULT_SCOREBOARD);
        this.dataSize = 5;
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
     * @param playerscore player's score template. including name and score
     */
    async addPlayer(playerscore: ScoreConfig): Promise<void> {
        if (this.validateScoreConfig(playerscore)) {
            if (!(await this.validateSize())) {
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

    async deleteLowestPlayer(): Promise<ModifyResult<ScoreConfig>> {
        return this.collection
            .find()
            .sort({ score: 1 })
            .limit(1)
            .toArray()
            .then(async (players: ScoreConfig[]) => {
                return this.collection.findOneAndDelete(players[0]);
            });
    }

    async validatePlayer(player: ScoreConfig): Promise<boolean> {
        return this.collection
            .find()
            .sort({ score: 1 })
            .limit(1)
            .toArray()
            .then((players: ScoreConfig[]) => {
                return players[0].score < player.score;
            });
    }

    private async validateSize() {
        this.dataSize = await this.collection.find({}).count();
        return this.dataSize < MAX;
    }

    private validateScoreConfig(player: ScoreConfig) {
        return player.score >= 0 && player.name !== undefined && player.name !== '' && player.name && player !== undefined;
    }
}
