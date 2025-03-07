import { Vec2 } from '@common/vec2';

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
export const STARTING_LETTER_AMOUNT = 7;
export const SECOND_MD = 1000;

export const COMMANDS = {
    exchange: '!échanger',
    place: '!placer',
    pass: '!passer',
    debug: '!debug',
    reserve: '!réserve',
};

export const KEYBOARD_EVENT_RECEIVER = {
    chatbox: 'chatbox',
    easel: 'easel',
    board: 'board',
    none: 'none',
};

// Mouse Buttons
export const enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

// Reserve constants
export const RESERVE_EXCHANGE_LIMIT = 7;
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

//  le pointage associe aux tiles
const F_POINTS = 4;
const J_POINTS = 8;
const K_POINTS = 10;

export const RIGHT_ARROW = '➞';
export const DOWN_ARROW = '🠗';

export const LETTER_POINTS: Map<string, number> = new Map<string, number>([
    ['a', 1],
    ['b', 3],
    ['c', 3],
    ['d', 2],
    ['e', 1],
    ['f', F_POINTS],
    ['g', 2],
    ['h', F_POINTS],
    ['i', 1],
    ['j', J_POINTS],
    ['k', K_POINTS],
    ['l', 1],
    ['m', 2],
    ['n', 1],
    ['o', 1],
    ['p', 3],
    ['q', J_POINTS],
    ['r', 1],
    ['s', 1],
    ['t', 1],
    ['u', 1],
    ['v', F_POINTS],
    ['w', K_POINTS],
    ['x', K_POINTS],
    ['y', K_POINTS],
    ['z', K_POINTS],
    ['*', 0],
]);
// System name
export const SYSTEM_NAME = 'Système';
export const COMMAND_RESULT = 'Commande';

// Grid Service
export const MAX_FONT_MULTIPLIER = 2;
export const MIN_FONT_MULTIPLIER = 0;
export const POINT_FONT_SIZE_MODIFIER = 1;
export const LETTER_FONT_SIZE_MODIFIER = 2;
export const BASE_LETTER_FONT_SIZE = 22;
export const BASE_POINT_FONT_SIZE = 11;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const GRID_WIDTH = 563.5;
export const GRID_HEIGHT = 563.5;
export const NUMBER_LINES = 16;
export const BOARD_SIZE = 15;
export const STEP = CANVAS_HEIGHT / (BOARD_SIZE + 1);
export const LETTER_OFFSET = STEP / 2;
const POINT_NUM = 5.7;
const POINT_DENUM = 6;
export const POINT_OFFSET = STEP * (POINT_NUM / POINT_DENUM);
export const INVALID_COORDS: Vec2 = { x: -1, y: -1 };
export const INVALID_POINT = -1;

//  les nombres permettant de creer la fraction equivalentes au offset
const NUM = 5;
const DENUM = 6;
export const INDEX_OFFSET = STEP * (NUM / DENUM);
export const COLS: number[] = [];
for (let i = 1; i <= BOARD_SIZE; i++) {
    COLS.push(i);
}
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
export const TILE_MULTIPLIER = {
    l2: 2,
    l3: 3,
    w2: 2,
    w3: 3,
};
export const TILE_TYPE = {
    noBonus: 0,
    letterX2: 1,
    letterX3: 2,
    wordX2: 3,
    wordX3: 4,
};
export const TILE_COLORS = {
    tile: '#F5EACD',
    l2: '#b9e7e4',
    l3: '#00a7d4',
    w2: '#ffad91',
    w3: '#D84141',
};
export const TILE_TEXT_COLOR = '#060606';
export const TEMP_TILE_COLOR = '#76B947';
//  the index to tiles of red colors
const RED_MULTIPLIER_INDEX = 4;
export const POINT_GRID = [
    [RED_MULTIPLIER_INDEX, 0, 0, 1, 0, 0, 0, RED_MULTIPLIER_INDEX, 0, 0, 0, 1, 0, 0, RED_MULTIPLIER_INDEX],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [RED_MULTIPLIER_INDEX, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, RED_MULTIPLIER_INDEX],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    [RED_MULTIPLIER_INDEX, 0, 0, 1, 0, 0, 0, RED_MULTIPLIER_INDEX, 0, 0, 0, 1, 0, 0, RED_MULTIPLIER_INDEX],
];
export const TILE_NUM_BONUS = 7;
export const FULL_EASEL_BONUS = 50;
export const LIGHT_BLUE_MULTIPLIER = 2;
export const DARK_BLUE_MULTIPLIER = 3;
export const PINK_MULTIPLIER = 2;
export const RED_MULTIPLIER = 3;
export const MAX_DESCRIPTION_LENGTH = 50;

export const VIRTUAL_PLAYER_MAX_TURN_DURATION = 20000;

export const PLAYER_DELETE_MESSAGE = "Impossible de supprimer ce nom, assurez-vous qu'il ne s'agit pas d'un nom par défaut";
export const PLAYER_MODIFY_MESSAGE = 'Impossible de modifier ce nom, assurez-vous que le nouveau nom ne correspond pas à un nom existant';
export const PLAYER_ADD_MESSAGE = "Impossible d'ajouter ce nom, assurez-vous qu'il ne s'agit pas d'un nom par défaut";
export const DICTIONARY_MODIFY_MESSAGE = 'Impossible de modifier ce dictionnaire, vérifiez que tous les dictionnaires ont des noms distincts';

export const SNACKBAR_CONFIG = { duration: 4000, panelClass: ['red-snackbar'] };
