import { Move } from '@common/move';

export interface Objective {
    reward: number;
    check: (move: Move) => boolean;

    playerName?: string;
    private?: boolean;
    achieved?: boolean;
}

const objective1: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

const objective2: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

const objective3: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

const objective4: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

const objective5: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

const objective6: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

const objective7: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

const objective8: Objective = {
    reward: 0,
    // eslint-disable-next-line no-unused-vars
    check: (move: Move): boolean => {
        return false;
    },
};

export const OBJECTIVES: Objective[] = [objective1, objective2, objective3, objective4, objective5, objective6, objective7, objective8];
