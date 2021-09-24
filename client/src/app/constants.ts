/* eslint-disable @typescript-eslint/no-magic-numbers */
// Game Config constants
export const DURATION_INIT = 60;
export const MAX_USERNAME_LENGTH = 20;
export const MIN_USERNAME_LENGTH = 2;

export const DIALOG_HEIGHT = '80%';
export const DIALOG_WIDTH = '60%';

// Game Manager constants
export const FIRST_PLAYER_COIN_FLIP = 0.5;
export const STARTING_TILE_AMOUNT = 7;
export const SECOND_MD = 1000;

export const COMMANDS = {
    exchange: '!exchange',
    place: '!place',
    pass: '!pass',
};

// Reserve constants
export const MIN_EXCHANGE_RESERVE_COUNT = 7;
export const FULL_RESERVE_COUNT = 102;
export const CLASSIC_RESERVE = `A,9,1
B,2,3
C,2,3
D,3,2
E,15,1
F,2,4
G,2,2
H,2,4
I,8,1
J,1,8
K,1,10
L,5,1
M,3,2
N,6,1
O,6,1
P,2,3
Q,1,8
R,6,1
S,6,1
T,6,1
U,6,1
V,2,4
W,1,10
X,1,10
Y,1,10
Z,1,10
*,2,0`;

// System name
export const SYSTEM_NAME = 'Système';

export const COMMAND_RESULT = 'Commande';
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const NUMBER_LINES = 16;
export const GRID_SIZE = 15;
export const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
export const NO_MULTIPLIER = '#F5EACD';
export const L2_MULTIPLIER = '#b9e7e4';
export const L3_MULTIPLIER = '#00a7d4';
export const W2_MULTIPLIER = '#ffad91';
export const W3_MULTIPLIER = '#D84141';
export const BOARD_MULTIPLIER = [
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [4, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 4],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
];
