/* eslint-disable deprecation/deprecation */
/* eslint-disable import/no-deprecated */
import { ScoreConfig } from '@app/classes/score-config';
import { ClassicRankingService } from '@app/services/classic-ranking.service';
import { Log2990RankingService } from '@app/services/log2990-ranking.service';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DatabaseController {
    router: Router;

    constructor(private classicRanking: ClassicRankingService, private log2990Ranking: Log2990RankingService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * returns all players ordered according to score. Highest first
         */
        this.router.get('/ranking/classic', async (req: Request, res: Response, next: NextFunction) => {
            this.classicRanking
                .getAllPlayers()
                .then((courses: ScoreConfig[]) => {
                    res.json(courses);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/ranking/log2990', async (req: Request, res: Response, next: NextFunction) => {
            this.log2990Ranking
                .getAllPlayers()
                .then((courses: ScoreConfig[]) => {
                    res.json(courses);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        /**
         * adds a player to the top list
         */
        this.router.post('/ranking/classic', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body);
            this.classicRanking
                .addPlayer(req.body)
                .then(() => {
                    res.status(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/ranking/log2990', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body);
            this.log2990Ranking
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
            this.classicRanking
                .addPlayer(req.body)
                .then(() => {
                    res.status(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/ranking/classic/:playerName', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.params.playerName);
            this.classicRanking
                .deletePlayerByName(req.params.playerName)
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/ranking/classic/lowest', async (req: Request, res: Response, next: NextFunction) => {
            this.classicRanking
                .deleteLowestPlayer()
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/ranking/log2990/lowest', async (req: Request, res: Response, next: NextFunction) => {
            this.log2990Ranking
                .deleteLowestPlayer()
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
