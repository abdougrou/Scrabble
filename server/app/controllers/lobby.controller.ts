import { LobbyManager } from "@app/services/lobby-manager";
import { Lobby } from "@common/lobby";
import * as express from "express";
import { Service } from "typedi";

@Service()
export class LobbyController {
    public router: express.Router;
    constructor() {
        this.router = express.Router();
        this.router.get("/", (req, res) => {
            const lobbies: Lobby[] = Array.from(LobbyManager.lobbies.values());
            res.send(lobbies);
        })
        this.router.put("/", (req, res) => {
            const key = LobbyManager.createLobby(req.body);
            res.send({key : key});
        })
    }
}
