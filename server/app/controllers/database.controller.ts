/* eslint-disable deprecation/deprecation */
/* eslint-disable import/no-deprecated */
import { Playerscore } from '@app/classes/playerscore';
import { TopscoresService } from '@app/services/topscores.service';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DatabaseController {
    router: Router;

    constructor(private coursesService: TopscoresService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * returns all players and their scores in the database
         */
        this.router.get('/top', async (req: Request, res: Response, next: NextFunction) => {
            this.coursesService
                .getAllCourses()
                .then((courses: Playerscore[]) => {
                    res.json(courses);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        // TODO: get that returns an ordered array

        //         this.router.get('/:subjectCode', async (req: Request, res: Response, next: NextFunction) => {
        //             this.coursesService
        //                 .getCourse(req.params.subjectCode)
        //                 .then((course: Playerscore) => {
        //                     res.json(course);
        //                 })
        //                 .catch((error: Error) => {
        //                     res.status(Httpstatus.NOT_FOUND).send(error.message);
        //                 });
        //         });

        /**
         * adds a player to the top list
         */
        this.router.post('/top', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body);
            this.coursesService
                .addPlayer(req.body)
                .then(() => {
                    res.status(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        /**
         * TODO: Replaces the player with the lowest score.
         */
        this.router.put('/top', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body);
            this.coursesService
                .addPlayer(req.body)
                .then(() => {
                    res.status(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        //         this.router.patch('/', async (req: Request, res: Response, next: NextFunction) => {
        //             this.coursesService
        //                 .modifyCourse(req.body)
        //                 .then(() => {
        //                     res.sendStatus(Httpstatus.OK);
        //                 })
        //                 .catch((error: Error) => {
        //                     res.status(Httpstatus.NOT_FOUND).send(error.message);
        //                 });
        //         });

        this.router.delete('top/:playerName', async (req: Request, res: Response, next: NextFunction) => {
            this.coursesService
                .deletePlayerByName(req.params.playerName)
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        //         this.router.get('/teachers/code/:subjectCode', async (req: Request, res: Response, next: NextFunction) => {
        //             this.coursesService
        //                 .getCourseTeacher(req.params.subjectCode)
        //                 .then((teacher: string) => {
        //                     res.send(teacher);
        //                 })
        //                 .catch((error: Error) => {
        //                     res.status(Httpstatus.NOT_FOUND).send(error.message);
        //                 });
        //         });

        //         this.router.get('/teachers/name/:name', async (req: Request, res: Response, next: NextFunction) => {
        //             this.coursesService
        //                 .getCoursesByTeacher(req.params.name)
        //                 .then((courses: Playerscore[]) => {
        //                     res.send(courses);
        //                 })
        //                 .catch((error: Error) => {
        //                     res.status(Httpstatus.NOT_FOUND).send(error.message);
        //                 });
        //         });
    }
}
