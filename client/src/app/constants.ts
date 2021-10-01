/* eslint-disable @typescript-eslint/no-magic-numbers */
// Game Config constants
export const DURATION_INIT = 60;
export const MAX_USERNAME_LENGTH = 20;
export const MIN_USERNAME_LENGTH = 2;

export const DIALOG_HEIGHT = '80%';
export const DIALOG_WIDTH = '60%';

// Player Info
export const RANDOM_PLAYER_NAMES = ['Nikolay', 'Sami', 'Augustin'];
export const MAX_SKIP_COUNT = 6;

// Game Manager constants
export const FIRST_PLAYER_COIN_FLIP = 0.5;
export const STARTING_TILE_AMOUNT = 7;
export const SECOND_MD = 1000;

export const COMMANDS = {
    exchange: '!echanger',
    place: '!placer',
    pass: '!passer',
    debug: '!debug',
};

// Reserve constants
export const MIN_EXCHANGE_RESERVE_COUNT = 7;
export const FULL_RESERVE_COUNT = 102;
export const CLASSIC_RESERVE = `a,9,1
b,2,3
c,2,3
d,3,2
e,15,1
f,2,4
g,2,2
h,2,4
i,8,1
j,1,8
k,1,10
l,5,1
m,3,2
n,6,1
o,6,1
p,2,3
q,1,8
r,6,1
s,6,1
t,6,1
u,6,1
v,2,4
w,1,10
x,1,10
y,1,10
z,1,10
*,2,0`;

// System name
export const SYSTEM_NAME = 'Système';
export const COMMAND_RESULT = 'Commande';

// Grid Service
export const BASE_LETTER_FONT_SIZE = 25;
export const BASE_INDEX_FONT_SIZE = 14;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const GRID_WIDTH = 575;
export const GRID_HEIGHT = 575;
export const NUMBER_LINES = 16;
export const GRID_SIZE = 15;
export const STEP = CANVAS_HEIGHT / (GRID_SIZE + 1);
export const LETTER_OFFSET = STEP / 2;
export const INDEX_OFFSET = STEP * (5 / 6);
export const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
export const TILE_COLORS = {
    tile: '#F5EACD',
    l2: '#b9e7e4',
    l3: '#00a7d4',
    w2: '#ffad91',
    w3: '#D84141',
};
export const TILE_TEXT_COLOR = '#060606';
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

export const WRONG_PLAYER = "Ce n'est pas votre tour";
export const EMPTY_RESERVE = "Il n'y a pas assez de tuiles dans la réserve";
export const NOT_ON_EASEL = 'Votre chevalet ne contient pas les lettres nécessaires';
export const WORD_EXISTS = 'Le mot que vous tentez de placer se trouve deja sur le tableau';
export const NOT_IN_DICTIONNARY = 'le mot nest pas dans le dictionnaire';
export const INVALID_WORD_POSITION = 'la position de votre mot nest pas valide';
