import { HttpException } from '@app/classes/http.exception';
import { Playerscore } from '@app/classes/playerscore';
import { Collection } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

// CHANGE the URL for your database information
const DATABASE_COLLECTION = 'topscores';
const MAX = 5;
let dataSize = 0;
@Service()
export class TopscoresService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<Playerscore> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    /**
     *
     * @returns all data in the database collection sorted highest first
     */
    async getAllPlayers(): Promise<Playerscore[]> {
        return this.collection
            .find({})
            .sort({ score: -1 })
            .limit(MAX)
            .toArray()
            .then((players: Playerscore[]) => {
                return players;
            });
    }

    /**
     *
     * @param player player's name
     * @returns player's score template
     */
    async getPlayerByName(player: string): Promise<Playerscore> {
        // NB: This can return null if the course does not exist, you need to handle it
        return this.collection.findOne({ name: player }).then((playerscore: Playerscore) => {
            return playerscore;
        });
    }

    /**
     *
     * @param playerscore player's score template. including name and score
     */
    async addPlayer(playerscore: Playerscore): Promise<void> {
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

    async replaceLowestPlayer(player: Playerscore): Promise<void> {
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
            .then(async (players: Playerscore[]) => {
                console.log('lowstplayer', players[0]);
                return await this.collection.findOneAndDelete({ score: players[0].score });
            });
    }

    // async getCourseTeacher(sbjCode: string): Promise<string> {
    //     const filterQuery: FilterQuery<Playerscore> = { subjectCode: sbjCode };
    //     // Only get the teacher and not any of the other fields
    //     const projection: FindOneOptions = { projection: { teacher: 1, _id: 0 } };
    //     return this.collection
    //         .findOne(filterQuery, projection)
    //         .then((course: Playerscore) => {
    //             return course.teacher;
    //         })
    //         .catch(() => {
    //             throw new Error('Failed to get data');
    //         });
    // }
    //     async getCoursesByTeacher(name: string): Promise<Playerscore[]> {
    //         const filterQuery: FilterQuery<Playerscore> = { teacher: name };
    //         return this.collection
    //             .find(filterQuery)
    //             .toArray()
    //             .then((courses: Playerscore[]) => {
    //                 return courses;
    //             })
    //             .catch(() => {
    //                 throw new Error('No courses for that teacher');
    //             });
    //     }

    //     private validateCourse(course: Playerscore): boolean {
    //         return this.validateCode(course.subjectCode) && this.validateCredits(course.credits);
    //     }
    //     private validateCode(subjectCode: string): boolean {
    //         return subjectCode.startsWith('LOG') || subjectCode.startsWith('INF');
    //     }
    private async validatePlayer(player: Playerscore): Promise<boolean> {
        this.updateSize();
        console.log('datasize:', dataSize);
        if ((dataSize = MAX))
            return this.collection
                .find()
                .sort({ score: 1 })
                .limit(1)
                .toArray()
                .then((players: Playerscore[]) => {
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
