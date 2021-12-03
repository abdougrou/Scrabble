import { ClassicRankingService } from '@app/services/classic-ranking.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { Log2990RankingService } from '@app/services/log2990-ranking.service';
import { VirtualPlayerNamesService } from '@app/services/virtual-player-names.service';
import { PlayerName } from '@common/player-name';
import { ScoreConfig } from '@common/score-config';
import { Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DatabaseController {
    router: Router;

    constructor(
        private classicRanking: ClassicRankingService,
        private log2990Ranking: Log2990RankingService,
        private virtualPlayerNames: VirtualPlayerNamesService,
        private dictionaryService: DictionaryService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * returns all players ordered according to score. Highest first
         */
        this.router.get('/ranking/classic', async (req: Request, res: Response) => {
            this.classicRanking
                .getAllPlayers()
                .then((courses: ScoreConfig[]) => {
                    res.json(courses);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/ranking/log2990', async (req: Request, res: Response) => {
            this.log2990Ranking
                .getAllPlayers()
                .then((courses: ScoreConfig[]) => {
                    res.json(courses);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        /**
         * adds a player to the top list, or replaces the lowest player if size = 5
         */
        this.router.post('/ranking/classic', async (req: Request, res: Response) => {
            this.classicRanking
                .addPlayer(req.body)
                .then(() => {
                    res.status(Httpstatus.StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/ranking/log2990', async (req: Request, res: Response) => {
            this.log2990Ranking
                .addPlayer(req.body)
                .then(() => {
                    res.status(Httpstatus.StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/ranking/reset', async (req: Request, res: Response) => {
            this.classicRanking
                .reset()
                .then(() => {
                    res.status(Httpstatus.StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
            this.log2990Ranking
                .reset()
                .then(() => {
                    res.status(Httpstatus.StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/player-names/reset', async (req: Request, res: Response) => {
            this.virtualPlayerNames
                .reset()
                .then(() => {
                    res.status(Httpstatus.StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/player-names/delete', async (req: Request, res: Response) => {
            this.virtualPlayerNames
                .deletePlayer(req.body)
                .then((success) => {
                    res.json(success);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/player-names', async (req: Request, res: Response) => {
            this.virtualPlayerNames
                .addPlayer(req.body)
                .then((success) => {
                    res.json(success);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/player-names', async (req: Request, res: Response) => {
            this.virtualPlayerNames
                .getAllNames()
                .then((names: PlayerName[]) => {
                    res.json(names);
                })
                .catch((error: Error) => {
                    res.json([]);
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/player-names/expert', async (req: Request, res: Response) => {
            this.virtualPlayerNames
                .getExpertPlayerNames()
                .then((names: PlayerName[]) => {
                    res.json(names);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/player-names/beginner', async (req: Request, res: Response) => {
            this.virtualPlayerNames
                .getBeginnerPlayerNames()
                .then((names: PlayerName[]) => {
                    res.json(names);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/player-names/modify', async (req: Request, res: Response) => {
            this.virtualPlayerNames
                .modifyPlayer(req.body[0], req.body[1])
                .then((response: boolean) => {
                    res.json(response);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/dictionary/reset', async () => {
            this.dictionaryService.reset();
        });

        this.router.post('/dictionary', async (req: Request, res: Response) => {
            const fileTemplate = req.body;
            res.json(this.dictionaryService.addDictionary(fileTemplate));
        });

        this.router.get('/dictionary', async (req: Request, res: Response) => {
            res.json(this.dictionaryService.getDictionaryInfo());
        });

        this.router.post('/dictionary/modify', async (req: Request, res: Response) => {
            res.json(this.dictionaryService.modifyDictionary(req.body[0], req.body[1]));
        });
        this.router.post('/dictionary/delete', async (req: Request) => {
            this.dictionaryService.deleteDictionary(req.body);
        });

        this.router.post('/dictionary/file', async (req: Request, res: Response) => {
            res.json(this.dictionaryService.sendDictionaryFile(req.body));
        });
    }
}
