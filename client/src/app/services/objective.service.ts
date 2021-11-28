import { Injectable } from '@angular/core';
import { Objective, OBJECTIVES } from '@app/classes/objective';
import { Player } from '@app/classes/player';
import { Trie } from '@app/classes/trie';
import { Move } from '@common/move';

@Injectable({
    providedIn: 'root',
})
export class ObjectiveService {
    objectives: Objective[];

    initialize() {
        const SORT_RANDOM = 0.5;
        const OBJECTIVES_COUNT = 4;
        this.objectives = OBJECTIVES.map((objective) => Object.assign({}, objective));
        this.objectives.sort(() => SORT_RANDOM - Math.random());
        while (this.objectives.length > OBJECTIVES_COUNT) this.objectives.pop();
    }

    /**
     * Assigns a random objective to a player
     *
     * @param name player's name
     */
    assignObjective(name: string) {
        const objective = this.objectives.pop() as Objective;
        objective.playerName = name;
        objective.private = true;
        this.objectives.push(objective);
    }

    /**
     * Checks if a player has achieved an objective and rewards them with points
     *
     * @param player player to check for objective completion
     * @param move the move done by the player
     * @param usedLetters the letters taken from the player's easel
     * @param placedWords dictionary containing words already placed on the board
     * @param pointMap point grid
     * @returns true if an objective was achieved, false otherwise
     */
    check(player: Player, move: Move, usedLetters?: string[], placedWords?: Trie, pointMap?: Map<string, number>): boolean {
        for (const objective of this.objectives) {
            if (!objective.achieved && (!objective.private || objective.playerName === player.name)) {
                const objectiveResult = objective.check(move, usedLetters, placedWords, pointMap);
                if (objectiveResult) {
                    player.score += objective.reward;
                    objective.achieved = true;
                    return true;
                }
            }
        }
        return false;
    }
}
