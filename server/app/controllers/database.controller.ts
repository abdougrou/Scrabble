/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable deprecation/deprecation */
/* eslint-disable import/no-deprecated */
import { ClassicRankingService } from '@app/services/classic-ranking.service';
import { Log2990RankingService } from '@app/services/log2990-ranking.service';
import { VirtualPlayerNamesService } from '@app/services/virtual-player-names.service';
import { PlayerName } from '@common/player-name';
import { ScoreConfig } from '@common/score-config';
import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DatabaseController {
    router: Router;

    constructor(
        private classicRanking: ClassicRankingService,
        private log2990Ranking: Log2990RankingService,
        private virtualPlayerNames: VirtualPlayerNamesService,
    ) {
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
         * adds a player to the top list, or replaces the lowest player if size = 5
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
         * deletes lowest player
         */
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

        this.router.delete('/ranking/reset', async (req: Request, res: Response, next: NextFunction) => {
            this.classicRanking
                .reset()
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
            this.log2990Ranking
                .reset()
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/player-names/reset', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNames
                .reset()
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/player-names/delete', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNames
                .deletePlayer(req.body)
                .then((success) => {
                    res.json(success);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/player-names', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNames
                .addPlayer(req.body)
                .then((success) => {
                    res.json(success);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/player-names', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNames
                .getAllNames()
                .then((names: PlayerName[]) => {
                    res.json(names);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/player-names/expert', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNames
                .getExpertPlayerNames()
                .then((names: PlayerName[]) => {
                    res.json(names);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/player-names/beginner', async (req: Request, res: Response, next: NextFunction) => {
            this.virtualPlayerNames
                .getBeginnerPlayerNames()
                .then((names: PlayerName[]) => {
                    res.json(names);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
        this.router.post('/player-names/modify', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body);
            this.virtualPlayerNames
                .modifyPlayer(req.body[0], req.body[1])
                .then((response: boolean) => {
                    res.json(response);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
