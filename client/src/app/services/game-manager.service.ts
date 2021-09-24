import { Injectable } from '@angular/core';
import { GameConfig } from '@app/classes/game-config';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { Tile } from '@app/classes/tile';
import { Vec2 } from '@app/classes/vec2';
import { FIRST_PLAYER_COIN_FLIP, SECOND_MD, STARTING_TILE_AMOUNT } from '@app/constants';
import { BehaviorSubject, timer } from 'rxjs';
import { BoardService } from './board.service';
import { PlayerService } from './player.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    turnDuration: number;
    currentTurnDurationLeft: number;

    mainPlayerName: string;
    enemyPlayerName: string;
    commandResult = new BehaviorSubject<ChatMessage>({ user: '', body: '' } as ChatMessage);

    constructor(private board: BoardService, private reserve: ReserveService, private players: PlayerService) {}

    initialize(gameConfig: GameConfig) {
        this.mainPlayerName = gameConfig.playerName1;
        this.enemyPlayerName = gameConfig.playerName2;
        this.turnDuration = gameConfig.duration;
        this.currentTurnDurationLeft = gameConfig.duration;

        this.initializePlayers([gameConfig.playerName1, gameConfig.playerName2]);

        this.startTimer();
    }

    startTimer() {
        const source = timer(0, SECOND_MD);
        source.subscribe((seconds) => {
            this.currentTurnDurationLeft = this.turnDuration - (seconds % this.turnDuration) - 1;
            if (this.currentTurnDurationLeft === 0) {
                this.currentTurnDurationLeft = this.turnDuration;
                this.switchPlayers();

                // TODO send player switch event
            }
        });
    }

    initializePlayers(playerNames: string[]) {
        this.players.createPlayer(playerNames[0], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        this.players.createPlayer(playerNames[1], this.reserve.getLetters(STARTING_TILE_AMOUNT));
        if (Math.random() > FIRST_PLAYER_COIN_FLIP) this.switchPlayers();
    }

    switchPlayers() {
        this.players.switchPlayers();
        this.currentTurnDurationLeft = this.turnDuration;
        // Send player switch event
    }

    giveTiles(player: Player, amount: number) {
        const tiles: Tile[] = this.reserve.getLetters(amount);
        player.easel.addTiles(tiles);
    }

    exchangeTiles(tiles: string, player: Player): string {
        if (this.players.current !== player) {
            return "Ce n'est pas votre tour";
        } else if (!this.reserve.isExchangePossible(tiles.length)) {
            return "Il n'y a pas assez de tuiles dans la réserve";
            // } else if (!player.easel.containsTiles(tiles)) {
            //     return 'Votre chevalet ne contient pas les lettres nécessaires';
        } else {
            this.reserve.returnLetters(player.easel.getTiles(tiles));
            player.easel.addTiles(this.reserve.getLetters(tiles.length));
            return player.name + ' a échangé les lettres suivantes (' + tiles + ') avec la réserve';
        }
    }
    // eslint-disable-next-line no-unused-vars
    placeTiles(word: string, coord: Vec2, vertical: boolean, player: Player) {
        // verify if its the first play of the game (should be in H8)
        // if (this.players.current !== player) {
        //     // not player turn
        // } else if (!player.easel.containsTiles(word)) {
        //     // player doesn't have tiles in easel
        // } else
        if (vertical) {
            for (let i = 0; i < word.length; i++) {
                this.board.placeTile(
                    {
                        x: coord.x,
                        y: coord.y + i,
                    },
                    {
                        letter: word[i],
                        points: 0,
                    },
                );
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                this.board.placeTile(
                    {
                        x: coord.x + i,
                        y: coord.y,
                    },
                    {
                        letter: word[i],
                        points: 0,
                    },
                );
            }
        }
    }
}
