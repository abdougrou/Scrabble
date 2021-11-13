import { Playerscore } from '@app/classes/playerscore';
import { Collection } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

// CHANGE the URL for your database information
const DATABASE_COLLECTION = 'topscores';
@Service()
export class TopscoresService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<Playerscore> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    async getAllCourses(): Promise<Playerscore[]> {
        return this.collection
            .find({})
            .toArray()
            .then((courses: Playerscore[]) => {
                return courses;
            });
    }

    //     async getCourse(sbjCode: string): Promise<Playerscore> {
    //         // NB: This can return null if the course does not exist, you need to handle it
    //         return this.collection.findOne({ subjectCode: sbjCode }).then((course: Playerscore) => {
    //             return course;
    //         });
    //     }

    //     async addCourse(course: Playerscore): Promise<void> {
    //         if (this.validateCourse(course)) {
    //             await this.collection.insertOne(course).catch((error: Error) => {
    //                 throw new HttpException(500, 'Failed to insert course');
    //             });
    //         } else {
    //             throw new Error('Invalid course');
    //         }
    //     }

    //     async deleteCourse(sbjCode: string): Promise<void> {
    //         return this.collection
    //             .findOneAndDelete({ subjectCode: sbjCode })
    //             .then((res: FindAndModifyWriteOpResultObject<Playerscore>) => {
    //                 if (!res.value) {
    //                     throw new Error('Could not find course');
    //                 }
    //             })
    //             .catch(() => {
    //                 throw new Error('Failed to delete course');
    //             });
    //     }

    //     async modifyCourse(course: Playerscore): Promise<void> {
    //         const filterQuery: FilterQuery<Playerscore> = { subjectCode: course.subjectCode };
    //         const updateQuery: UpdateQuery<Playerscore> = {
    //             $set: {
    //                 subjectCode: course.subjectCode,
    //                 credits: course.credits,
    //                 name: course.name,
    //                 teacher: course.teacher,
    //             },
    //         };
    //         // Can also use replaceOne if we want to replace the entire object
    //         return this.collection
    //             .updateOne(filterQuery, updateQuery)
    //             .then(() => {})
    //             .catch(() => {
    //                 throw new Error('Failed to update document');
    //             });
    //     }

    //     async getCourseTeacher(sbjCode: string): Promise<string> {
    //         const filterQuery: FilterQuery<Playerscore> = { subjectCode: sbjCode };
    //         // Only get the teacher and not any of the other fields
    //         const projection: FindOneOptions = { projection: { teacher: 1, _id: 0 } };
    //         return this.collection
    //             .findOne(filterQuery, projection)
    //             .then((course: Playerscore) => {
    //                 return course.teacher;
    //             })
    //             .catch(() => {
    //                 throw new Error('Failed to get data');
    //             });
    //     }
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
    //     private validateCredits(credits: number): boolean {
    //         return credits > 0 && credits <= 6;
    //     }
}
