import { LobbyService } from '@app/services/lobby.service';
import { LobbyConfig } from '@common/lobby-config';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class LobbyController {
    router: Router;
    constructor(lobbyService: LobbyService) {
        this.router = Router();

        this.router.get('/', (req: Request, res: Response) => {
            const lobbies: LobbyConfig[] = lobbyService
                .getLobbies()
                .filter((lobby) => !lobby.started)
                .map((lobby) => lobby.config);
            res.send(lobbies);
        });

        this.router.put('/', (req: Request, res: Response) => {
            const key = lobbyService.createLobby(req.body);
            res.send({ key });
        });

        this.router.delete('/', (req: Request, res: Response) => {
            const key = lobbyService.deleteLobby(req.body);
            res.send({ key });
        });
    }
}
