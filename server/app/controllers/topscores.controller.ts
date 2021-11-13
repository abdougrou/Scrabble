/* eslint-disable no-unused-vars */
import { Playerscore } from '@app/classes/playerscore';
import { TopscoresService } from '@app/services/topscores.service';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class TopscoresController {
    router: Router;

    constructor(private coursesService: TopscoresService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.coursesService
                .getAllCourses()
                .then((courses: Playerscore[]) => {
                    res.json(courses);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });

            // Can also use the async/await syntax
            // try {
            //     const courses = await this.coursesService.getAllCourses();
            //     res.json(courses);
            // } catch (error) {
            //     res.status(Httpstatus.NOT_FOUND).send(error.message);
            // }
        });

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

        //         this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
        //             console.log(req.body);
        //             this.coursesService
        //                 .addCourse(req.body)
        //                 .then(() => {
        //                     res.status(Httpstatus.CREATED).send();
        //                 })
        //                 .catch((error: Error) => {
        //                     res.status(Httpstatus.NOT_FOUND).send(error.message);
        //                 });
        //         });

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

        //         this.router.delete('/:subjectCode', async (req: Request, res: Response, next: NextFunction) => {
        //             this.coursesService
        //                 .deleteCourse(req.params.subjectCode)
        //                 .then(() => {
        //                     res.status(Httpstatus.NO_CONTENT).send();
        //                 })
        //                 .catch((error: Error) => {
        //                     console.log(error);
        //                     res.status(Httpstatus.NOT_FOUND).send(error.message);
        //                 });
        //         });

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
